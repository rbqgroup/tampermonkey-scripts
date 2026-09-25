import type { Artwork, PixivResponse, UgoiraMetadata } from './types'

/** 带 HTTP 状态码的 Pixiv 请求错误。 */
export class PixivApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
  }
}

/** Pixiv 同源接口封装。 */
export class PixivApi {
  private readonly artworkCache = new Map<string, Artwork>()
  private csrfToken = ''

  /** 获取作品数据；失败的请求不会写入缓存。 */
  public async getArtwork(id: string, signal?: AbortSignal): Promise<Artwork> {
    signal?.throwIfAborted()
    const cached = this.artworkCache.get(id)
    if (cached) return cached

    return this.refreshArtwork(id, signal)
  }

  /** 绕过缓存获取最新作品数据，并保持已有缓存对象的引用不变。 */
  public async refreshArtwork(id: string, signal?: AbortSignal): Promise<Artwork> {
    signal?.throwIfAborted()

    const data = await this.request<PixivResponse<Artwork>>(
      `/ajax/illust/${id}?time=${Date.now()}`,
      { signal }
    )
    if (data.error || !data.body) {
      throw new PixivApiError(data.message || '获取作品数据失败', 200)
    }

    const cached = this.artworkCache.get(id)
    if (cached) {
      Object.assign(cached, data.body)
      return cached
    }
    this.artworkCache.set(id, data.body)
    return data.body
  }

  /** 获取 Ugoira 压缩包地址和逐帧延迟。 */
  public async getUgoiraMetadata(
    id: string,
    signal?: AbortSignal
  ): Promise<UgoiraMetadata> {
    const data = await this.request<PixivResponse<UgoiraMetadata>>(
      `/ajax/illust/${id}/ugoira_meta`,
      { signal }
    )
    if (data.error || !data.body) {
      throw new PixivApiError(data.message || '获取动图数据失败', 200)
    }
    return data.body
  }

  /** 将作品公开收藏并附带原始标签。 */
  public async addBookmark(artwork: Artwork): Promise<void> {
    await this.sendBookmark(artwork, false)
  }

  /** 使用收藏记录 ID 取消收藏。 */
  public async deleteBookmark(
    artworkId: string,
    bookmarkId: string
  ): Promise<void> {
    await this.sendDeleteBookmark(artworkId, bookmarkId, false)
  }

  /** 发送收藏请求；token 失效时只刷新并重试一次。 */
  private async sendBookmark(
    artwork: Artwork,
    tokenRefreshed: boolean
  ): Promise<void> {
    const token = await this.getCsrfToken(artwork.id, tokenRefreshed)
    try {
      await this.request<PixivResponse<unknown>>('/ajax/illusts/bookmarks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'x-csrf-token': token,
        },
        body: JSON.stringify({
          comment: '',
          illust_id: artwork.illustId || artwork.id,
          restrict: 0,
          tags: artwork.tags.tags.map(({ tag }) => tag),
        }),
      })
    } catch (error) {
      if (
        error instanceof PixivApiError &&
        error.status === 400 &&
        !tokenRefreshed
      ) {
        this.csrfToken = ''
        await this.sendBookmark(artwork, true)
        return
      }
      throw error
    }
  }

  /** 发送取消收藏请求；token 失效时只刷新并重试一次。 */
  private async sendDeleteBookmark(
    artworkId: string,
    bookmarkId: string,
    tokenRefreshed: boolean
  ): Promise<void> {
    const token = await this.getCsrfToken(artworkId, tokenRefreshed)
    try {
      await this.request<PixivResponse<unknown>>(
        '/ajax/illusts/bookmarks/delete',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'x-csrf-token': token,
          },
          body: new URLSearchParams({ bookmark_id: bookmarkId }),
        }
      )
    } catch (error) {
      if (
        error instanceof PixivApiError &&
        error.status === 400 &&
        !tokenRefreshed
      ) {
        this.csrfToken = ''
        await this.sendDeleteBookmark(artworkId, bookmarkId, true)
        return
      }
      throw error
    }
  }

  /** 从当前页面或作品页面源码中读取 CSRF token。 */
  private async getCsrfToken(
    artworkId: string,
    forceRefresh: boolean
  ): Promise<string> {
    if (this.csrfToken && !forceRefresh) return this.csrfToken

    const currentSource = document.querySelector('#__NEXT_DATA__')?.textContent
    let token = this.extractCsrfToken(currentSource || document.documentElement.innerHTML)
    if (!token || forceRefresh) {
      const response = await fetch(`/artworks/${artworkId}`, {
        credentials: 'same-origin',
        cache: 'no-store',
      })
      if (!response.ok) {
        throw new PixivApiError('无法刷新收藏凭证', response.status)
      }
      token = this.extractCsrfToken(await response.text())
    }

    if (!token) throw new PixivApiError('页面中未找到收藏凭证', 0)
    this.csrfToken = token
    return token
  }

  /** 兼容 Pixiv 页面中未转义和反斜杠转义的 token。 */
  private extractCsrfToken(source: string): string {
    const patterns = [
      /"token":"([a-f\d]{32})"/i,
      /\\"token\\":\\"([a-f\d]{32})\\"/i,
      /"postKey":"([a-f\d]{32})"/i,
      /\\"postKey\\":\\"([a-f\d]{32})\\"/i,
    ]
    for (const pattern of patterns) {
      const token = source.match(pattern)?.[1]
      if (token) return token
    }
    return ''
  }

  /** 发送同源请求并统一处理 HTTP 与 Pixiv 业务错误。 */
  private async request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      credentials: 'same-origin',
      ...init,
    })
    if (!response.ok) {
      throw new PixivApiError(`Pixiv 请求失败: HTTP ${response.status}`, response.status)
    }

    const data = (await response.json()) as T & {
      error?: boolean
      message?: string
    }
    if (data.error) {
      throw new PixivApiError(data.message || 'Pixiv 请求失败', response.status)
    }
    return data
  }
}
