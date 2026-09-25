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

  /** 将明确识别出的 Pixiv 收藏按钮同步为红心，不触发原生收藏操作。 */
  public syncBookmarkIcon(cardElement?: HTMLElement): void {
    if (!cardElement) return

    const bookmarkButton =
      cardElement.querySelector<HTMLButtonElement>(
        'button[data-ga4-label="bookmark_button"]'
      ) ||
      cardElement
        .querySelector<SVGSVGElement>('button svg[width="32"]')
        ?.closest<HTMLButtonElement>('button')
    const bookmarkSvg = bookmarkButton?.querySelector<SVGSVGElement>('svg')
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

  /** 将常见 HTTP 状态转换成可操作的错误提示。 */
  private getErrorMessage(error: unknown): string {
    if (!(error instanceof PixivApiError)) return '收藏失败，请检查网络连接'
    switch (error.status) {
      case 401:
        return '收藏失败，请先登录 Pixiv'
      case 403:
        return '收藏失败，账号当前无权执行此操作'
      case 429:
        return '收藏过于频繁，请稍后再试'
      default:
        return `收藏失败：${error.message}`
    }
  }
}
