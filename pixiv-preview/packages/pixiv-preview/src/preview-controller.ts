import { ArtworkLocator } from './artwork-locator'
import { BookmarkController } from './bookmark-controller'
import { PixivApi, PixivApiError } from './api'
import { Notification } from './notification'
import type { ArtworkRenderer } from './renderer'
import type { Artwork, ArtworkTarget } from './types'

const SHOW_DELAY = 400
const WHEEL_THROTTLE = 100
const INFO_HEIGHT = 25
const VIEWPORT_MARGIN = 8
const PREVIEW_GAP = 6

/** 管理悬浮预览的生命周期、定位、切图和快捷键。 */
export class PreviewController {
  private readonly wrap = document.createElement('div')
  private readonly info = document.createElement('div')
  private readonly locator = new ArtworkLocator()
  private activeTarget?: ArtworkTarget
  private artwork?: Artwork
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
    private readonly notification: Notification
  ) {
    this.wrap.className = 'ppv-preview'
    this.info.className = 'ppv-preview-info'
    this.wrap.append(this.info)
    document.body.append(this.wrap)
    this.bindEvents()
  }

  /** 使用事件委托绑定 Pixiv 动态页面所需的所有事件。 */
  private bindEvents(): void {
    document.addEventListener('pointerover', this.onPointerOver, true)
    document.addEventListener('pointerout', this.onPointerOut, true)
    document.addEventListener('wheel', this.onWheel, {
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
    }, SHOW_DELAY)
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
    try {
      const artwork = await this.api.getArtwork(target.id)
      if (!this.isCurrent(target, version)) return

      this.artwork = artwork
      this.index = 0
      await this.render(version)
    } catch (error) {
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
  }

  /** 加载当前页图片并原子替换预览内容。 */
  private async render(version: number): Promise<void> {
    const artwork = this.artwork
    const target = this.activeTarget
    if (!artwork || !target) return

    const index = this.index
    const image = await this.renderer.load(artwork, index)
    if (!this.isCurrent(target, version) || this.index !== index) {
      image.src = ''
      return
    }

    this.wrap.querySelector('img')?.remove()
    this.updateInfo(artwork, image)
    this.sizeAndPosition(image, target.element)
    this.wrap.append(image)
    this.wrap.classList.add('ppv-preview-visible')
    this.preloadNext(artwork, index)
  }

  /** 更新顶部摘要信息。 */
  private updateInfo(artwork: Artwork, image: HTMLImageElement): void {
    this.info.replaceChildren()
    const values = [
      artwork.pageCount > 1 ? `${this.index + 1}/${artwork.pageCount}` : '',
      `收藏 ${artwork.bookmarkCount}`,
      `${image.naturalWidth}×${image.naturalHeight}`,
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
  private sizeAndPosition(image: HTMLImageElement, element: HTMLElement): void {
    const rect = element.getBoundingClientRect()
    const leftSpace = rect.left - PREVIEW_GAP - VIEWPORT_MARGIN
    const rightSpace =
      window.innerWidth - rect.right - PREVIEW_GAP - VIEWPORT_MARGIN
    const placeLeft = leftSpace >= rightSpace
    const availableWidth = Math.max(1, placeLeft ? leftSpace : rightSpace)
    const availableHeight = window.innerHeight - VIEWPORT_MARGIN * 2 - INFO_HEIGHT
    const scale = Math.min(
      1,
      availableWidth / image.naturalWidth,
      availableHeight / image.naturalHeight
    )
    const width = Math.max(1, Math.floor(image.naturalWidth * scale))
    const height = Math.max(1, Math.floor(image.naturalHeight * scale))
    const left = placeLeft
      ? rect.left - PREVIEW_GAP - width
      : rect.right + PREVIEW_GAP
    const centeredTop = rect.top + rect.height / 2 - (height + INFO_HEIGHT) / 2
    const top = Math.min(
      Math.max(VIEWPORT_MARGIN, centeredTop),
      window.innerHeight - height - INFO_HEIGHT - VIEWPORT_MARGIN
    )

    this.wrap.style.width = `${width}px`
    this.wrap.style.left = `${Math.round(left)}px`
    this.wrap.style.top = `${Math.round(top)}px`
    image.style.height = `${height}px`
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
    void this.render(++this.version).catch((error) => {
      console.error('[Pixiv Preview]', error)
    })
  }

  /** 预览显示时处理关闭与收藏快捷键。 */
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
    if (event.code !== 'KeyB' || event.repeat) return

    event.preventDefault()
    event.stopPropagation()
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement) activeElement.blur()
    const artwork = this.artwork
    void this.bookmarkController.add(artwork).then((success) => {
      const image = this.wrap.querySelector('img')
      if (success && this.artwork === artwork && image) {
        this.updateInfo(artwork, image)
      }
    })
  }

  /** 预加载下一页，失败不会影响当前预览。 */
  private preloadNext(artwork: Artwork, index: number): void {
    if (index + 1 >= artwork.pageCount) return
    const image = new Image()
    image.src = this.renderer.getUrl(artwork, index + 1)
  }

  /** 检查异步结果是否仍属于当前悬浮目标。 */
  private isCurrent(target: ArtworkTarget, version: number): boolean {
    return this.activeTarget?.element === target.element && this.version === version
  }

  /** 清理所有可见状态并使旧异步任务失效。 */
  private hide = (): void => {
    window.clearTimeout(this.showTimer)
    this.version++
    this.activeTarget = undefined
    this.artwork = undefined
    this.index = 0
    this.wrap.classList.remove('ppv-preview-visible')
    const image = this.wrap.querySelector('img')
    if (image) image.src = ''
    image?.remove()
  }
}
