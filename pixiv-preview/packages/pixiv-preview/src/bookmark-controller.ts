import { PixivApi, PixivApiError } from './api'
import { Notification } from './notification'
import type { Artwork } from './types'

/** 管理互不阻塞且不会重复提交的收藏任务。 */
export class BookmarkController {
  private readonly pending = new Set<string>()

  constructor(
    private readonly api: PixivApi,
    private readonly notification: Notification
  ) {}

  /** 启动收藏操作，并返回本次请求是否成功。 */
  public async add(
    artwork: Artwork,
    cardElement?: HTMLElement
  ): Promise<boolean> {
    if (artwork.bookmarkData) {
      this.notification.show('这个作品已经收藏', 'info')
      return false
    }
    if (this.pending.has(artwork.id)) {
      this.notification.show('收藏请求正在处理中', 'info')
      return false
    }

    this.pending.add(artwork.id)
    this.notification.show('正在收藏作品', 'info')
    try {
      await this.api.addBookmark(artwork)
      artwork.bookmarkData = { id: '', private: false }
      artwork.bookmarkCount++
      this.syncBookmarkIcon(cardElement)
      this.notification.show('已收藏', 'success')
      return true
    } catch (error) {
      this.notification.show(this.getErrorMessage(error), 'error')
      return false
    } finally {
      this.pending.delete(artwork.id)
    }
  }

  /** 查询服务端最新状态后取消收藏，并返回删除请求是否成功。 */
  public async remove(
    artwork: Artwork,
    cardElement?: HTMLElement
  ): Promise<boolean> {
    if (this.pending.has(artwork.id)) {
      this.notification.show('收藏状态请求正在处理中', 'info')
      return false
    }

    this.pending.add(artwork.id)
    this.notification.show('正在检查收藏状态', 'info')
    try {
      const latestArtwork = await this.api.refreshArtwork(artwork.id)
      const bookmarkId = latestArtwork.bookmarkData?.id
      if (!bookmarkId) {
        this.notification.show('这个作品尚未收藏', 'info')
        return false
      }

      await this.api.deleteBookmark(artwork.id, bookmarkId)
      latestArtwork.bookmarkData = null
      latestArtwork.bookmarkCount = Math.max(0, latestArtwork.bookmarkCount - 1)
      this.syncUnbookmarkIcon(cardElement)
      this.notification.show('已取消收藏', 'success')
      return true
    } catch (error) {
      this.notification.show(this.getErrorMessage(error, '取消收藏'), 'error')
      return false
    } finally {
      this.pending.delete(artwork.id)
    }
  }

  /** 将明确识别出的 Pixiv 收藏按钮同步为红心，不触发原生收藏操作。 */
  public syncBookmarkIcon(cardElement?: HTMLElement): void {
    if (!cardElement) return

    const bookmarkSvg = this.findBookmarkSvg(cardElement)
    if (bookmarkSvg && getComputedStyle(bookmarkSvg).color !== 'rgb(255, 64, 96)') {
      bookmarkSvg.style.color = 'rgb(255, 64, 96)'
      for (const path of bookmarkSvg.querySelectorAll('path')) {
        path.style.fill = 'currentcolor'
      }
    }

    const oneClickBookmark = cardElement.querySelector('._one-click-bookmark')
    if (!oneClickBookmark?.classList.contains('on')) {
      oneClickBookmark?.classList.add('on')
    }
  }

  /** 将明确识别出的 Pixiv 收藏按钮恢复为空心状态。 */
  private syncUnbookmarkIcon(cardElement?: HTMLElement): void {
    if (!cardElement) return

    const bookmarkSvg = this.findBookmarkSvg(cardElement)
    if (bookmarkSvg) {
      bookmarkSvg.style.color = 'inherit'
      for (const path of bookmarkSvg.querySelectorAll('path')) {
        path.style.fill = 'none'
      }
    }
    cardElement.querySelector('._one-click-bookmark')?.classList.remove('on')
  }

  /** 严格查找新版 Pixiv 缩略图的收藏图标。 */
  private findBookmarkSvg(cardElement: HTMLElement): SVGSVGElement | undefined {
    const bookmarkButton =
      cardElement.querySelector<HTMLButtonElement>(
        'button[data-ga4-label="bookmark_button"]'
      ) ||
      cardElement
        .querySelector<SVGSVGElement>('button svg[width="32"]')
        ?.closest<HTMLButtonElement>('button')
    return bookmarkButton?.querySelector<SVGSVGElement>('svg') || undefined
  }

  /** 将常见 HTTP 状态转换成可操作的错误提示。 */
  private getErrorMessage(error: unknown, action = '收藏'): string {
    if (!(error instanceof PixivApiError)) return `${action}失败，请检查网络连接`
    switch (error.status) {
      case 401:
        return `${action}失败，请先登录 Pixiv`
      case 403:
        return `${action}失败，账号当前无权执行此操作`
      case 429:
        return `${action}过于频繁，请稍后再试`
      default:
        return `${action}失败：${error.message}`
    }
  }
}
