import { PixivApi } from './api'
import { BookmarkController } from './bookmark-controller'
import { BrowserImageCache } from './browser-image-cache'
import { Notification } from './notification'
import { PreviewController } from './preview-controller'
import { ArtworkRendererDispatcher, StaticArtworkRenderer } from './renderer'
import { DEFAULT_SETTINGS, SettingsStore } from './settings'
import { SettingsPanel } from './settings-panel'
import { injectStyle } from './style'
import { UgoiraArtworkRenderer } from './ugoira-renderer'

/** 持久化设置使用的油猴存储键。 */
const SETTINGS_KEY = 'pixivPreviewSettings'

/** 初始化独立的 Pixiv 悬浮预览功能。 */
function bootstrap(): void {
  injectStyle()
  const api = new PixivApi()
  const notification = new Notification()
  const settings = new SettingsStore({
    get: () => GM_getValue(SETTINGS_KEY, DEFAULT_SETTINGS),
    set: (value) => GM_setValue(SETTINGS_KEY, value),
  })
  const bookmarkController = new BookmarkController(api, notification)
  const imageCache = new BrowserImageCache(settings.value.cacheWorks)
  const staticRenderer = new StaticArtworkRenderer(imageCache, settings)
  const renderer = new ArtworkRendererDispatcher(
    staticRenderer,
    new UgoiraArtworkRenderer(api, settings)
  )
  let previousSettings = settings.value
  settings.subscribe((nextSettings) => {
    imageCache.setMaxWorks(nextSettings.cacheWorks)
    if (nextSettings.imageQuality !== previousSettings.imageQuality) {
      imageCache.clear()
    } else if (!nextSettings.preloadEnabled) {
      imageCache.cancelPreload()
    }
    previousSettings = nextSettings
  })
  new SettingsPanel(settings, notification)
  new PreviewController(
    api,
    renderer,
    bookmarkController,
    notification,
    settings
  )
}

bootstrap()
