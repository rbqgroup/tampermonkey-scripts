import { BrowserImageCache } from './browser-image-cache'
import type { Artwork } from './types'

interface GMProgressEvent {
  lengthComputable: boolean
  loaded: number
  total: number
}

interface GMResponse<T> {
  response: T
  status: number
  statusText: string
}

interface GMRequestControl {
  abort(): void
}

interface GMRequestOptions<T> {
  method: 'GET'
  url: string
  headers?: Record<string, string>
  responseType: 'blob'
  onprogress(event: GMProgressEvent): void
  onload(response: GMResponse<T>): void
  onerror(response: GMResponse<T>): void
  onabort(): void
  ontimeout(): void
}

declare function GM_xmlhttpRequest<T>(
  options: GMRequestOptions<T>
): GMRequestControl

/** 图片下载的真实字节进度。 */
export interface LoadProgress {
  loaded: number
  total?: number
}

/** 已加载的预览资源及其释放方法。 */
export interface RenderedArtwork {
  image: HTMLImageElement
  dispose(): void
}

/** 作品预览渲染器，为后续动图渲染保留稳定边界。 */
export interface ArtworkRenderer {
  load(
    artwork: Artwork,
    index: number,
    signal: AbortSignal,
    onProgress: (progress: LoadProgress) => void
  ): Promise<RenderedArtwork>
  preload(
    artwork: Artwork,
    currentIndex: number,
    signal: AbortSignal
  ): Promise<void>
  getUrl(artwork: Artwork, index: number): string
}

/** 通过 Tampermonkey 跨域请求下载并渲染静态图片。 */
export class StaticArtworkRenderer implements ArtworkRenderer {
  constructor(private readonly cache: BrowserImageCache) {}

  /** 下载指定页并返回可主动释放的 Blob 图片。 */
  public async load(
    artwork: Artwork,
    index: number,
    signal: AbortSignal,
    onProgress: (progress: LoadProgress) => void
  ): Promise<RenderedArtwork> {
    const cachedImage = await this.cache.createImage(
      artwork.id,
      index,
      signal
    )
    if (cachedImage) {
      onProgress({ loaded: 1, total: 1 })
      return {
        image: cachedImage,
        dispose: () => {
          cachedImage.src = ''
        },
      }
    }

    return this.download(artwork, index, signal, onProgress)
  }

  /** 顺序预加载作品的所有图片到浏览器缓存。 */
  public preload(
    artwork: Artwork,
    currentIndex: number,
    signal: AbortSignal
  ): Promise<void> {
    return this.cache.preload(artwork, currentIndex, signal, (index) =>
      this.getUrl(artwork, index)
    )
  }

  /** 使用 GM 请求下载未命中的图片并报告真实进度。 */
  private download(
    artwork: Artwork,
    index: number,
    signal: AbortSignal,
    onProgress: (progress: LoadProgress) => void
  ): Promise<RenderedArtwork> {
    return new Promise((resolve, reject) => {
      let request: GMRequestControl | undefined
      let objectUrl = ''
      let settled = false

      const cleanup = () => signal.removeEventListener('abort', abort)
      const fail = (error: Error) => {
        if (settled) return
        settled = true
        cleanup()
        if (objectUrl) URL.revokeObjectURL(objectUrl)
        reject(error)
      }
      const abort = () => {
        request?.abort()
        fail(new DOMException('预览已取消', 'AbortError'))
      }

      signal.addEventListener('abort', abort, { once: true })
      request = GM_xmlhttpRequest<Blob>({
        method: 'GET',
        url: this.getUrl(artwork, index),
        headers: { Referer: 'https://www.pixiv.net/' },
        responseType: 'blob',
        onprogress: (event) => {
          if (settled) return
          onProgress({
            loaded: event.loaded,
            total:
              event.lengthComputable && event.total > 0
                ? event.total
                : undefined,
          })
        },
        onload: (response) => {
          if (signal.aborted) return abort()
          if (response.status < 200 || response.status >= 300) {
            fail(
              new Error(
                `预览图片请求失败: HTTP ${response.status} ${response.statusText}`
              )
            )
            return
          }

          onProgress({
            loaded: response.response.size,
            total: response.response.size,
          })
          objectUrl = URL.createObjectURL(response.response)
          const image = new Image()
          image.alt = artwork.title
          image.onload = () => {
            if (signal.aborted) return abort()
            settled = true
            cleanup()
            resolve({
              image,
              dispose: () => {
                image.src = ''
                URL.revokeObjectURL(objectUrl)
              },
            })
          }
          image.onerror = () => fail(new Error('预览图片解码失败'))
          image.src = objectUrl
        },
        onerror: (response) => {
          fail(
            new Error(
              `预览图片请求失败: HTTP ${response.status} ${response.statusText}`
            )
          )
        },
        onabort: () => fail(new DOMException('预览已取消', 'AbortError')),
        ontimeout: () => fail(new Error('预览图片请求超时')),
      })

      if (signal.aborted) abort()
    })
  }

  /** 由第一页 regular 地址生成指定页地址。 */
  public getUrl(artwork: Artwork, index: number): string {
    return artwork.urls.regular.replace(/_p0(?=[_.])/, `_p${index}`)
  }
}
