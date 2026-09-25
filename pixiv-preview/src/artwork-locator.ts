import type { ArtworkTarget } from './types'

/** 从事件目标中识别包含缩略图的作品链接。 */
export class ArtworkLocator {
  /** 查找当前事件对应的作品；标题等不含图片的链接不会触发预览。 */
  public find(target: EventTarget | null): ArtworkTarget | undefined {
    if (!(target instanceof Element)) return

    const link = target.closest<HTMLAnchorElement>('a[href*="/artworks/"]')
    if (!link || !link.querySelector('img')) return

    const id = new URL(link.href, location.href).pathname.match(
      /^\/artworks\/(\d+)/
    )?.[1]
    if (!id) return
    return {
      id,
      element: link,
      cardElement: this.findCardElement(link, id),
    }
  }

  /** 查找只对应当前作品且包含收藏按钮的最小卡片容器。 */
  private findCardElement(
    link: HTMLAnchorElement,
    artworkId: string
  ): HTMLElement | undefined {
    let element = link.parentElement
    while (element && element !== document.body) {
      const artworkIds = new Set(
        [...element.querySelectorAll<HTMLAnchorElement>('a[href*="/artworks/"]')]
          .map((item) => this.getArtworkId(item.href))
          .filter((id): id is string => Boolean(id))
      )
      if (artworkIds.size > 1 || !artworkIds.has(artworkId)) return
      if (
        element.querySelector('button svg') ||
        element.querySelector('._one-click-bookmark')
      ) {
        return element
      }
      element = element.parentElement
    }
  }

  /** 从作品链接中提取数字 ID。 */
  private getArtworkId(url: string): string | undefined {
    return new URL(url, location.href).pathname.match(/^\/artworks\/(\d+)/)?.[1]
  }
}
