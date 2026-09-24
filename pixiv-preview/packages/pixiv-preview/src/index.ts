import { PixivApi } from './api'
import { BookmarkController } from './bookmark-controller'
import { BrowserImageCache } from './browser-image-cache'
import { Notification } from './notification'
import { PreviewController } from './preview-controller'
import { StaticArtworkRenderer } from './renderer'
import { injectStyle } from './style'

/** 初始化独立的 Pixiv 悬浮预览功能。 */
function bootstrap(): void {
  injectStyle()
  const api = new PixivApi()
  const notification = new Notification()
  const bookmarkController = new BookmarkController(api, notification)
  const imageCache = new BrowserImageCache(3)
  new PreviewController(
    api,
    new StaticArtworkRenderer(imageCache),
    bookmarkController,
    notification
  )
}

bootstrap()
