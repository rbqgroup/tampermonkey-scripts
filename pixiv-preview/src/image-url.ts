import type { ImageQuality } from './settings.ts'
import type { Artwork } from './types'

/** 根据清晰度和页码生成作品图片地址。 */
export function getImageUrl(
  artwork: Artwork,
  index: number,
  quality: ImageQuality
): string {
  return artwork.urls[quality].replace(/_p0(?=[_.])/, `_p${index}`)
}
