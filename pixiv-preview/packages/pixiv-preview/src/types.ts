/** Pixiv 作品标签。 */
export interface ArtworkTag {
  tag: string
  translation?: Record<string, string>
}

/** Pixiv 收藏状态。 */
export interface BookmarkData {
  id: string
  private: boolean
}

/** 预览功能使用的 Pixiv 作品数据。 */
export interface Artwork {
  id: string
  illustId?: string
  illustType: number
  pageCount: number
  width: number
  height: number
  bookmarkCount: number
  title: string
  urls: {
    regular: string
    original: string
  }
  tags: {
    tags: ArtworkTag[]
  }
  bookmarkData: BookmarkData | null
}

/** Pixiv AJAX 接口的公共响应结构。 */
export interface PixivResponse<T> {
  error: boolean
  message: string
  body: T
}

/** 当前鼠标指向的作品缩略图。 */
export interface ArtworkTarget {
  id: string
  element: HTMLAnchorElement
  cardElement?: HTMLElement
}
