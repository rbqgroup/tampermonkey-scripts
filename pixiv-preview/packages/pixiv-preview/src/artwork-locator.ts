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
    return { id, element: link }
  }
}
