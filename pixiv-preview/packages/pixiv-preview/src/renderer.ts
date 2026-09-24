import type { Artwork } from './types'

/** 作品预览渲染器，为后续动图渲染保留稳定边界。 */
export interface ArtworkRenderer {
  load(artwork: Artwork, index: number): Promise<HTMLImageElement>
  getUrl(artwork: Artwork, index: number): string
}

/** 渲染单图、漫画和动图封面。 */
export class StaticArtworkRenderer implements ArtworkRenderer {
  /** 加载指定页并返回具有真实尺寸的图片元素。 */
  public load(artwork: Artwork, index: number): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.alt = artwork.title
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('预览图片加载失败'))
      image.src = this.getUrl(artwork, index)
    })
  }

  /** 由第一页 regular 地址生成指定页地址。 */
  public getUrl(artwork: Artwork, index: number): string {
    return artwork.urls.regular.replace(/_p0(?=[_.])/, `_p${index}`)
  }
}
