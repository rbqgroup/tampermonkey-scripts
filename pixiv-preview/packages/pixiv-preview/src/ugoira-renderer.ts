import {
  BlobReader,
  BlobWriter,
  ZipReader,
  type FileEntry,
} from '@zip.js/zip.js/lib/zip-core-native.js'

import { PixivApi } from './api'
import type {
  ArtworkRenderer,
  LoadProgress,
  RenderedArtwork,
} from './renderer'
import { SettingsStore } from './settings'
import type { Artwork, UgoiraMetadata } from './types'
import { UgoiraPlayer, calculateDecodeSize } from './ugoira-player'

const MAX_ARCHIVE_BYTES = 96 * 1024 * 1024
const MAX_FRAME_BYTES = 32 * 1024 * 1024
const MAX_DECODE_PIXELS = 2_000_000

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

/** 下载 Ugoira ZIP 并以恒定内存逐帧播放。 */
export class UgoiraArtworkRenderer implements ArtworkRenderer {
  constructor(
    private readonly api: PixivApi,
    private readonly settings: SettingsStore
  ) {}

  public async load(
    artwork: Artwork,
    _index: number,
    signal: AbortSignal,
    onProgress: (progress: LoadProgress) => void
  ): Promise<RenderedArtwork> {
    const metadata = await this.api.getUgoiraMetadata(artwork.id, signal)
    this.validateMetadata(metadata)
    const url =
      this.settings.value.imageQuality === 'original'
        ? metadata.originalSrc
        : metadata.src
    const archive = await this.download(url, signal, onProgress)
    signal.throwIfAborted()

    const reader = new ZipReader(new BlobReader(archive), {
      useCompressionStream: true,
      useWebWorkers: false,
    })
    const lifetime = new AbortController()
    const abort = () => lifetime.abort(signal.reason)
    signal.addEventListener('abort', abort, { once: true })
    let readerClosed = false
    const closeReader = (reason?: unknown): Promise<void> | undefined => {
      if (readerClosed) return
      readerClosed = true
      signal.removeEventListener('abort', abort)
      lifetime.abort(reason)
      return reader.close()
    }

    try {
      const entries = await reader.getEntries()
      lifetime.signal.throwIfAborted()
      const files = new Map(
        entries
          .filter((entry): entry is FileEntry => !entry.directory)
          .map((entry) => [entry.filename, entry])
      )
      const orderedEntries = metadata.frames.map(({ file }) => {
        const entry = files.get(file)
        if (!entry) throw new Error(`动图帧不存在: ${file}`)
        if (entry.uncompressedSize > MAX_FRAME_BYTES) {
          throw new Error(`动图单帧超过 ${MAX_FRAME_BYTES} 字节限制`)
        }
        return entry
      })

      const decodeSize = calculateDecodeSize(
        artwork.width,
        artwork.height,
        MAX_DECODE_PIXELS
      )
      const canvas = document.createElement('canvas')
      canvas.width = decodeSize.width
      canvas.height = decodeSize.height
      canvas.setAttribute('aria-label', artwork.title)
      const context = canvas.getContext('2d', { alpha: false })
      if (!context) throw new Error('浏览器不支持 Canvas 2D')

      const player = new UgoiraPlayer({
        frameCount: orderedEntries.length,
        getDelay: (index) => metadata.frames[index].delay,
        loadFrame: async (index) => {
          const blob = await orderedEntries[index].getData(
            new BlobWriter(metadata.mime_type),
            { signal: lifetime.signal, checkCrc32: true }
          )
          lifetime.signal.throwIfAborted()
          const bitmap = await createImageBitmap(blob, {
            resizeWidth: decodeSize.width,
            resizeHeight: decodeSize.height,
            resizeQuality: 'high',
          })
          if (lifetime.signal.aborted) {
            bitmap.close()
            lifetime.signal.throwIfAborted()
          }
          return bitmap
        },
        drawFrame: (frame) => {
          context.drawImage(frame as ImageBitmap, 0, 0)
        },
        schedule: (callback, delay) => window.setTimeout(callback, delay),
        cancelSchedule: (handle) => window.clearTimeout(handle),
        onError: (error) => {
          void closeReader(error)?.catch(() => undefined)
          console.error('[Pixiv Preview] 动图帧解码失败', error)
        },
      })
      await player.start()

      let disposed = false
      return {
        element: canvas,
        width: artwork.width,
        height: artwork.height,
        dispose: () => {
          if (disposed) return
          disposed = true
          const error = new DOMException('预览已取消', 'AbortError')
          void closeReader(error)?.catch(() => undefined)
          player.dispose()
          canvas.width = 1
          canvas.height = 1
        },
      }
    } catch (error) {
      await closeReader(error)?.catch(() => undefined)
      throw error
    }
  }

  public preload(): Promise<void> {
    return Promise.resolve()
  }

  public cancelPreload(): void {}

  public getUrl(artwork: Artwork): string {
    return artwork.urls.regular
  }

  private validateMetadata(metadata: UgoiraMetadata): void {
    if (metadata.mime_type !== 'image/jpeg') {
      throw new Error(`不支持的动图帧格式: ${metadata.mime_type}`)
    }
    if (!metadata.frames.length) throw new Error('动图没有可播放帧')
  }

  private download(
    url: string,
    signal: AbortSignal,
    onProgress: (progress: LoadProgress) => void
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let request: GMRequestControl | undefined
      let settled = false
      const finish = (blob?: Blob, error?: Error) => {
        if (settled) return
        settled = true
        signal.removeEventListener('abort', abort)
        if (error) reject(error)
        else if (blob) resolve(blob)
      }
      const abort = () => {
        request?.abort()
        finish(undefined, new DOMException('预览已取消', 'AbortError'))
      }
      const rejectOversized = () => {
        request?.abort()
        finish(undefined, new Error('动图文件过大，已停止预览以保护页面'))
      }

      signal.addEventListener('abort', abort, { once: true })
      request = GM_xmlhttpRequest<Blob>({
        method: 'GET',
        url,
        headers: { Referer: 'https://www.pixiv.net/' },
        responseType: 'blob',
        onprogress: (event) => {
          if (
            event.loaded > MAX_ARCHIVE_BYTES ||
            (event.lengthComputable && event.total > MAX_ARCHIVE_BYTES)
          ) {
            rejectOversized()
            return
          }
          onProgress({
            loaded: event.loaded,
            total: event.lengthComputable ? event.total : undefined,
          })
        },
        onload: (response) => {
          if (response.status < 200 || response.status >= 300) {
            finish(
              undefined,
              new Error(
                `动图请求失败: HTTP ${response.status} ${response.statusText}`
              )
            )
            return
          }
          if (response.response.size > MAX_ARCHIVE_BYTES) {
            rejectOversized()
            return
          }
          onProgress({
            loaded: response.response.size,
            total: response.response.size,
          })
          finish(response.response)
        },
        onerror: (response) =>
          finish(
            undefined,
            new Error(
              `动图请求失败: HTTP ${response.status} ${response.statusText}`
            )
          ),
        onabort: () =>
          finish(undefined, new DOMException('预览已取消', 'AbortError')),
        ontimeout: () => finish(undefined, new Error('动图请求超时')),
      })
      if (signal.aborted) abort()
    })
  }
}
