import { ArtworkLocator } from './artwork-locator'
import { BookmarkController } from './bookmark-controller'
import { PixivApi, PixivApiError } from './api'
import { Notification } from './notification'
import { SettingsStore } from './settings'
import type {
  ArtworkRenderer,
  LoadProgress,
  RenderedArtwork,
} from './renderer'
import type { Artwork, ArtworkTarget } from './types'

const WHEEL_THROTTLE = 100
const INFO_HEIGHT = 25
const VIEWPORT_MARGIN = 8
const PREVIEW_GAP = 6

/** 管理悬浮预览的生命周期、定位、切图和快捷键。 */
export class PreviewController {
  private readonly wrap = document.createElement('div')
  private readonly info = document.createElement('div')
  private readonly loadingPanel = document.createElement('div')
  private readonly loadingText = document.createElement('div')
  private readonly progressTrack = document.createElement('div')
  private readonly progressBar = document.createElement('div')
  private readonly locator = new ArtworkLocator()
  private activeTarget?: ArtworkTarget
  private artwork?: Artwork
  private activeRequest?: AbortController
  private renderedArtwork?: RenderedArtwork
  private index = 0
  private showTimer?: number
  private version = 0
  private lastWheelTime = 0
  private currentUrl = location.href
  private readonly routeObserver = new MutationObserver(() => {
    if (location.href === this.currentUrl) return
    this.currentUrl = location.href
    this.hide()
  })

  constructor(
    private readonly api: PixivApi,
    private readonly renderer: ArtworkRenderer,
    private readonly bookmarkController: BookmarkController,
    private readonly notification: Notification,
    private readonly settings: SettingsStore
  ) {
    this.wrap.className = 'ppv-preview'
    this.info.className = 'ppv-preview-info'
    this.loadingPanel.className = 'ppv-preview-loading-panel'
    this.loadingText.className = 'ppv-preview-loading-text'
    this.progressTrack.className = 'ppv-preview-progress-track'
    this.progressBar.className =
      'ppv-preview-progress-bar ppv-preview-progress-bar-indeterminate'
    this.progressTrack.append(this.progressBar)
    this.loadingPanel.append(this.loadingText, this.progressTrack)
    this.wrap.append(this.info, this.loadingPanel)
    document.body.append(this.wrap)
    this.bindEvents()
  }

  /** 使用事件委托绑定 Pixiv 动态页面所需的所有事件。 */
  private bindEvents(): void {
    document.addEventListener('pointerover', this.onPointerOver, true)
    document.addEventListener('pointerout', this.onPointerOut, true)
    window.addEventListener('wheel', this.onWheel, {
      capture: true,
      passive: false,
    })
    window.addEventListener('keydown', this.onKeyDown, true)
    window.addEventListener('scroll', this.hide, true)
    window.addEventListener('resize', this.hide)
    window.addEventListener('blur', this.hide)
    window.addEventListener('popstate', this.hide)
    this.routeObserver.observe(document.body, { childList: true, subtree: true })
  }

  /** 在进入新的作品缩略图后开始延迟预览。 */
  private onPointerOver = (event: PointerEvent): void => {
    const target = this.locator.find(event.target)
    if (!target) return
    if (this.activeTarget?.element === target.element) return

    this.hide()
    this.activeTarget = target
    const version = ++this.version
    this.showTimer = window.setTimeout(() => {
      void this.show(target, version)
    }, this.settings.value.showDelay)
  }

  /** 真正离开当前作品链接时关闭预览。 */
  private onPointerOut = (event: PointerEvent): void => {
    if (!this.activeTarget) return
    if (event.target instanceof Node && !this.activeTarget.element.contains(event.target)) {
      return
    }
    if (
      event.relatedTarget instanceof Node &&
      this.activeTarget.element.contains(event.relatedTarget)
    ) {
      return
    }
    this.hide()
  }

  /** 加载作品与第一页，并在确认请求仍有效后显示。 */
  private async show(target: ArtworkTarget, version: number): Promise<void> {
    const request = this.startRequest()
    this.showLoading(target.element, '正在获取作品信息')
    try {
      const artwork = await this.api.getArtwork(target.id, request.signal)
      if (!this.isCurrent(target, version)) return

      this.artwork = artwork
      if (artwork.bookmarkData) {
        this.bookmarkController.syncBookmarkIcon(target.cardElement)
      }
      this.index = 0
      this.showLoading(target.element, '正在连接图片资源')
      await this.render(version, request.signal)
    } catch (error) {
      this.handlePreviewError(error, target, version)
    }
  }

  /** 加载当前页图片并原子替换预览内容。 */
  private async render(version: number, signal: AbortSignal): Promise<void> {
    const artwork = this.artwork
    const target = this.activeTarget
    if (!artwork || !target) return

    const index = this.index
    const rendered = await this.renderer.load(
      artwork,
      index,
      signal,
      (progress) => {
        if (this.isCurrent(target, version) && this.index === index) {
          this.updateLoadingProgress(progress)
        }
      }
    )
    if (!this.isCurrent(target, version) || this.index !== index) {
      rendered.dispose()
      return
    }

    this.renderedArtwork = rendered
    const media = rendered.element
    media.className = 'ppv-preview-media'
    this.wrap.querySelector('.ppv-preview-media')?.remove()
    this.updateInfo(artwork, rendered.width, rendered.height)
    this.sizeAndPosition(media, rendered.width, rendered.height, target.element)
    this.wrap.append(media)
    this.wrap.classList.remove('ppv-preview-loading')
    this.wrap.classList.add('ppv-preview-visible', 'ppv-preview-ready')
    void this.renderer.preload(artwork, index)
  }

  /** 显示小型加载窗口，并重置为等待网络响应的状态。 */
  private showLoading(element: HTMLElement, message: string): void {
    this.loadingText.textContent = message
    this.progressBar.style.width = ''
    this.progressBar.classList.add('ppv-preview-progress-bar-indeterminate')
    this.positionWrap(element, 220, 68)
    this.wrap.classList.remove('ppv-preview-ready')
    this.wrap.classList.add('ppv-preview-visible', 'ppv-preview-loading')
  }

  /** 使用 Tampermonkey 提供的真实下载字节更新进度。 */
  private updateLoadingProgress(progress: LoadProgress): void {
    if (progress.total) {
      const percent = Math.min(
        100,
        Math.round((progress.loaded / progress.total) * 100)
      )
      this.loadingText.textContent = `${this.formatBytes(progress.loaded)} / ${this.formatBytes(progress.total)} (${percent}%)`
      this.progressBar.classList.remove(
        'ppv-preview-progress-bar-indeterminate'
      )
      this.progressBar.style.width = `${percent}%`
      return
    }

    this.loadingText.textContent = `已加载 ${this.formatBytes(progress.loaded)}`
  }

  /** 将字节数格式化成适合加载窗口显示的短文本。 */
  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  /** 更新顶部摘要信息。 */
  private updateInfo(artwork: Artwork, width: number, height: number): void {
    this.info.replaceChildren()
    const values = [
      artwork.pageCount > 1 ? `${this.index + 1}/${artwork.pageCount}` : '',
      `收藏 ${artwork.bookmarkCount}`,
      `${width}×${height}`,
      artwork.title,
    ]
    values.forEach((value, index) => {
      if (!value) return
      const span = document.createElement('span')
      span.textContent = value
      if (index === values.length - 1) span.className = 'ppv-preview-title'
      this.info.append(span)
    })
  }

  /** 按真实图片比例缩放，并放到缩略图空间较大的一侧。 */
  private sizeAndPosition(
    media: HTMLElement,
    mediaWidth: number,
    mediaHeight: number,
    element: HTMLElement
  ): void {
    const rect = element.getBoundingClientRect()
    const leftSpace = rect.left - PREVIEW_GAP - VIEWPORT_MARGIN
    const rightSpace =
      window.innerWidth - rect.right - PREVIEW_GAP - VIEWPORT_MARGIN
    const placeLeft = leftSpace >= rightSpace
    const availableWidth = Math.max(1, placeLeft ? leftSpace : rightSpace)
    const availableHeight = window.innerHeight - VIEWPORT_MARGIN * 2 - INFO_HEIGHT
    const scale = Math.min(
      1,
      availableWidth / mediaWidth,
      availableHeight / mediaHeight
    )
    const width = Math.max(1, Math.floor(mediaWidth * scale))
    const height = Math.max(1, Math.floor(mediaHeight * scale))
    this.positionWrap(element, width, height + INFO_HEIGHT, placeLeft)
    media.style.height = `${height}px`
  }

  /** 把加载窗口或图片预览放到缩略图空间较大的一侧。 */
  private positionWrap(
    element: HTMLElement,
    requestedWidth: number,
    height: number,
    preferredLeft?: boolean
  ): void {
    const rect = element.getBoundingClientRect()
    const leftSpace = rect.left - PREVIEW_GAP - VIEWPORT_MARGIN
    const rightSpace =
      window.innerWidth - rect.right - PREVIEW_GAP - VIEWPORT_MARGIN
    const placeLeft = preferredLeft ?? leftSpace >= rightSpace
    const availableWidth = Math.max(1, placeLeft ? leftSpace : rightSpace)
    const width = Math.min(requestedWidth, Math.max(120, availableWidth))
    const rawLeft = placeLeft
      ? rect.left - PREVIEW_GAP - width
      : rect.right + PREVIEW_GAP
    const left = Math.min(
      Math.max(VIEWPORT_MARGIN, rawLeft),
      window.innerWidth - width - VIEWPORT_MARGIN
    )
    const centeredTop = rect.top + rect.height / 2 - height / 2
    const top = Math.min(
      Math.max(VIEWPORT_MARGIN, centeredTop),
      window.innerHeight - height - VIEWPORT_MARGIN
    )

    this.wrap.style.width = `${Math.round(width)}px`
    this.wrap.style.left = `${Math.round(left)}px`
    this.wrap.style.top = `${Math.round(top)}px`
  }

  /** 在当前缩略图上滚动时循环切换多图页码。 */
  private onWheel = (event: WheelEvent): void => {
    if (
      !this.artwork ||
      !this.activeTarget ||
      this.artwork.pageCount <= 1 ||
      !this.wrap.classList.contains('ppv-preview-visible') ||
      !(event.target instanceof Node) ||
      !this.activeTarget.element.contains(event.target)
    ) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    const now = performance.now()
    if (now - this.lastWheelTime < WHEEL_THROTTLE) return
    this.lastWheelTime = now

    const count = this.artwork.pageCount
    this.index = (this.index + (event.deltaY < 0 ? -1 : 1) + count) % count
    const target = this.activeTarget
    const version = ++this.version
    const request = this.startRequest()
    this.showLoading(target.element, '正在连接图片资源')
    void this.render(version, request.signal).catch((error) => {
      this.handlePreviewError(error, target, version)
    })
  }

  /** 预览显示时处理关闭、收藏与取消收藏快捷键。 */
  private onKeyDown = (event: KeyboardEvent): void => {
    if (
      !this.artwork ||
      !this.wrap.classList.contains('ppv-preview-visible') ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.metaKey
    ) {
      return
    }

    if (event.code === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      this.hide()
      return
    }
    if ((event.code !== 'KeyB' && event.code !== 'KeyU') || event.repeat) return

    event.preventDefault()
    event.stopPropagation()
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement) activeElement.blur()
    const artwork = this.artwork
    const cardElement = this.activeTarget?.cardElement
    const operation =
      event.code === 'KeyB'
        ? this.bookmarkController.add(artwork, cardElement)
        : this.bookmarkController.remove(artwork, cardElement)
    void operation.then(() => {
      const rendered = this.renderedArtwork
      if (this.artwork === artwork && rendered) {
        this.updateInfo(artwork, rendered.width, rendered.height)
      }
    })
  }

  /** 终止旧任务并创建只属于当前预览请求的取消信号。 */
  private startRequest(): AbortController {
    this.activeRequest?.abort()
    this.renderedArtwork?.dispose()
    this.renderedArtwork = undefined
    this.wrap.querySelector('.ppv-preview-media')?.remove()
    const request = new AbortController()
    this.activeRequest = request
    return request
  }

  /** 忽略主动取消，只向当前预览报告真实请求错误。 */
  private handlePreviewError(
    error: unknown,
    target: ArtworkTarget,
    version: number
  ): void {
    if (error instanceof DOMException && error.name === 'AbortError') return
    if (this.isCurrent(target, version)) {
      const message =
        error instanceof PixivApiError && error.status === 429
          ? '预览请求过于频繁，请稍后再试'
          : '预览加载失败，请稍后重试'
      this.notification.show(message, 'error')
      this.hide()
    }
    console.error('[Pixiv Preview]', error)
  }

  /** 检查异步结果是否仍属于当前悬浮目标。 */
  private isCurrent(target: ArtworkTarget, version: number): boolean {
    return this.activeTarget?.element === target.element && this.version === version
  }

  /** 清理所有可见状态并使旧异步任务失效。 */
  private hide = (): void => {
    window.clearTimeout(this.showTimer)
    this.activeRequest?.abort()
    this.renderer.cancelPreload()
    this.activeRequest = undefined
    this.renderedArtwork?.dispose()
    this.renderedArtwork = undefined
    this.version++
    this.activeTarget = undefined
    this.artwork = undefined
    this.index = 0
    this.wrap.classList.remove(
      'ppv-preview-visible',
      'ppv-preview-loading',
      'ppv-preview-ready'
    )
    this.wrap.querySelector('.ppv-preview-media')?.remove()
  }
}
