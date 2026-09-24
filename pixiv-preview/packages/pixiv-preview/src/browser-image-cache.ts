import { consumeTasks } from './task-queue.ts'
import type { Artwork } from './types'

/** 单个作品已完成和进行中的图片任务。 */
interface WorkImageCache {
  images: Map<number, HTMLImageElement>
  inFlight: Map<number, Promise<HTMLImageElement | undefined>>
}

/** 当前作品的后台预加载任务。 */
interface PreloadTask {
  artworkId: string
  controller: AbortController
  promise: Promise<void>
}

/** 使用原生 Image 和 Chromium HTTP 缓存保留最近访问的作品图片。 */
export class BrowserImageCache {
  /** 按最近访问顺序保存作品缓存。 */
  private readonly works = new Map<string, WorkImageCache>()
  /** 最多保留的作品数量。 */
  private maxWorks: number
  /** 当前唯一的后台预加载队列。 */
  private preloadTask?: PreloadTask

  constructor(maxWorks = 3) {
    this.maxWorks = maxWorks
  }

  /** 为预览创建缓存图片副本；在途预加载存在时先等待同一任务。 */
  public async createImage(
    artworkId: string,
    index: number,
    signal: AbortSignal
  ): Promise<HTMLImageElement | undefined> {
    const cache = this.works.get(artworkId)
    if (!cache) return

    this.touch(artworkId, cache)
    let source = cache.images.get(index)
    const inFlight = cache.inFlight.get(index)
    if (!source && inFlight) {
      source = await this.waitForImage(inFlight, signal)
    }
    if (!source || this.works.get(artworkId) !== cache) return

    signal.throwIfAborted()
    const image = new Image()
    image.alt = source.alt
    image.fetchPriority = 'high'
    return this.loadImage(image, source.currentSrc || source.src, signal, true)
  }

  /** 使用多个 worker 按页码顺序领取并补齐作品图片。 */
  public preload(
    artwork: Artwork,
    currentIndex: number,
    getUrl: (index: number) => string,
    workerCount: number
  ): Promise<void> {
    if (this.preloadTask?.artworkId === artwork.id) {
      return this.preloadTask.promise
    }
    this.cancelPreload()

    const cache = this.getOrCreate(artwork.id)
    const tasks = Array.from({ length: artwork.pageCount }, (_, index) => index)
      .filter((index) => index !== currentIndex)
      .filter((index) => !cache.images.has(index))
    const controller = new AbortController()
    const task: PreloadTask = {
      artworkId: artwork.id,
      controller,
      promise: Promise.resolve(),
    }
    task.promise = consumeTasks(
      tasks,
      workerCount,
      (index) =>
        this.preloadImage(artwork, index, getUrl(index), cache, controller.signal),
      controller.signal
    ).finally(() => {
      if (this.preloadTask === task) this.preloadTask = undefined
    })
    this.preloadTask = task
    return task.promise
  }

  /** 取消当前作品尚未完成的全部预加载。 */
  public cancelPreload(): void {
    this.preloadTask?.controller.abort()
    this.preloadTask = undefined
  }

  /** 更新 LRU 容量，并立即淘汰超出限制的旧作品。 */
  public setMaxWorks(maxWorks: number): void {
    this.maxWorks = maxWorks
    this.evictOldest()
  }

  /** 取消预加载并释放全部图片引用。 */
  public clear(): void {
    this.cancelPreload()
    for (const cache of this.works.values()) this.release(cache)
    this.works.clear()
  }

  /** 加载单张预加载图片，并登记在途任务供前台复用。 */
  private async preloadImage(
    artwork: Artwork,
    index: number,
    url: string,
    cache: WorkImageCache,
    signal: AbortSignal
  ): Promise<void> {
    if (cache.images.has(index) || cache.inFlight.has(index)) return

    const image = new Image()
    image.alt = artwork.title
    image.decoding = 'async'
    image.fetchPriority = 'low'
    const loading = this.loadImage(image, url, signal, false)
    cache.inFlight.set(index, loading)
    const loaded = await loading
    if (cache.inFlight.get(index) === loading) cache.inFlight.delete(index)
    if (!loaded || signal.aborted) return
    if (this.works.get(artwork.id) !== cache) return
    cache.images.set(index, loaded)
  }

  /** 等待共享图片任务，同时只响应当前前台请求自己的取消信号。 */
  private waitForImage(
    loading: Promise<HTMLImageElement | undefined>,
    signal: AbortSignal
  ): Promise<HTMLImageElement | undefined> {
    signal.throwIfAborted()
    return new Promise((resolve, reject) => {
      const abort = () => {
        cleanup()
        reject(new DOMException('预览已取消', 'AbortError'))
      }
      const cleanup = () => signal.removeEventListener('abort', abort)
      signal.addEventListener('abort', abort, { once: true })
      void loading.then(
        (image) => {
          cleanup()
          resolve(image)
        },
        (error) => {
          cleanup()
          reject(error)
        }
      )
    })
  }

  /** 获取并刷新作品的 LRU 顺序。 */
  private getOrCreate(artworkId: string): WorkImageCache {
    const cache =
      this.works.get(artworkId) ||
      ({ images: new Map(), inFlight: new Map() } satisfies WorkImageCache)
    this.touch(artworkId, cache)
    return cache
  }

  /** 将作品移动到队尾。 */
  private touch(artworkId: string, cache: WorkImageCache): void {
    this.works.delete(artworkId)
    this.works.set(artworkId, cache)
    this.evictOldest()
  }

  /** 释放超出容量限制的最旧作品。 */
  private evictOldest(): void {
    while (this.works.size > this.maxWorks) {
      const oldestId = this.works.keys().next().value as string | undefined
      if (!oldestId) return
      if (this.preloadTask?.artworkId === oldestId) this.cancelPreload()
      const oldest = this.works.get(oldestId)
      this.works.delete(oldestId)
      if (oldest) this.release(oldest)
    }
  }

  /** 清空一个作品持有的原生图片引用。 */
  private release(cache: WorkImageCache): void {
    for (const image of cache.images.values()) image.src = ''
    cache.images.clear()
    cache.inFlight.clear()
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
