import type { Artwork } from './types'

interface WorkImageCache {
  images: Map<number, HTMLImageElement>
}

/** 使用原生 Image 和 Chromium HTTP 缓存保留最近访问的作品图片。 */
export class BrowserImageCache {
  private readonly works = new Map<string, WorkImageCache>()

  constructor(private readonly maxWorks = 3) {}

  /** 为预览创建已缓存图片的副本；未命中时不发起请求。 */
  public async createImage(
    artworkId: string,
    index: number,
    signal: AbortSignal
  ): Promise<HTMLImageElement | undefined> {
    const cache = this.works.get(artworkId)
    const source = cache?.images.get(index)
    if (!cache || !source) return

    this.touch(artworkId, cache)
    signal.throwIfAborted()
    const image = new Image()
    image.alt = source.alt
    image.fetchPriority = 'high'
    return this.loadImage(image, source.currentSrc || source.src, signal, true)
  }

  /** 顺序补齐一个作品的全部图片；取消后保留已经完成的部分。 */
  public async preload(
    artwork: Artwork,
    currentIndex: number,
    signal: AbortSignal,
    getUrl: (index: number) => string
  ): Promise<void> {
    const cache = this.getOrCreate(artwork.id)
    for (let index = 0; index < artwork.pageCount; index++) {
      if (signal.aborted) return
      if (index === currentIndex) continue
      if (cache.images.has(index)) continue

      const image = new Image()
      image.alt = artwork.title
      image.decoding = 'async'
      image.fetchPriority = 'low'
      const loaded = await this.loadImage(
        image,
        getUrl(index),
        signal,
        false
      ).catch(() => undefined)
      if (!loaded || signal.aborted) return
      if (this.works.get(artwork.id) !== cache) return
      cache.images.set(index, loaded)
    }
  }

  /** 获取并刷新作品的 LRU 顺序。 */
  private getOrCreate(artworkId: string): WorkImageCache {
    const cache = this.works.get(artworkId) || { images: new Map() }
    this.touch(artworkId, cache)
    return cache
  }

  /** 将作品移动到队尾，并释放超出限制的最旧作品引用。 */
  private touch(artworkId: string, cache: WorkImageCache): void {
    this.works.delete(artworkId)
    this.works.set(artworkId, cache)
    while (this.works.size > this.maxWorks) {
      const oldestId = this.works.keys().next().value as string | undefined
      if (!oldestId) return
      const oldest = this.works.get(oldestId)
      this.works.delete(oldestId)
      for (const image of oldest?.images.values() || []) image.src = ''
      oldest?.images.clear()
    }
  }

  /** 加载原生图片，并在取消时终止尚未完成的请求。 */
  private loadImage(
    image: HTMLImageElement,
    url: string,
    signal: AbortSignal,
    rejectOnAbort: boolean
  ): Promise<HTMLImageElement | undefined> {
    return new Promise((resolve, reject) => {
      let settled = false
      const finish = (result?: HTMLImageElement, error?: Error) => {
        if (settled) return
        settled = true
        signal.removeEventListener('abort', abort)
        image.onload = null
        image.onerror = null
        if (error) reject(error)
        else resolve(result)
      }
      const abort = () => {
        image.src = ''
        const error = rejectOnAbort
          ? new DOMException('预览已取消', 'AbortError')
          : undefined
        finish(undefined, error)
      }

      signal.addEventListener('abort', abort, { once: true })
      image.onload = () => finish(image)
      image.onerror = () => finish()
      image.src = url
      if (image.complete && image.naturalWidth > 0) finish(image)
      if (signal.aborted) abort()
    })
  }
}
