/** 图片请求使用的清晰度。 */
export type ImageQuality = 'regular' | 'original'

/** 用户可持久化调整的全部设置。 */
export interface PixivPreviewSettings {
  preloadEnabled: boolean
  preloadWorkers: number
  cacheWorks: number
  showDelay: number
  imageQuality: ImageQuality
}

/** 首次运行和异常设置的回退值。 */
export const DEFAULT_SETTINGS: PixivPreviewSettings = {
  preloadEnabled: true,
  preloadWorkers: 4,
  cacheWorks: 3,
  showDelay: 400,
  imageQuality: 'regular',
}

/** 设置持久化边界。 */
interface SettingsStorage {
  get(): unknown
  set(value: PixivPreviewSettings): void
}

/** 设置变更订阅函数。 */
type SettingsListener = (settings: Readonly<PixivPreviewSettings>) => void

/** 保存设置并向运行中的模块广播变更。 */
export class SettingsStore {
  /** 当前生效的设置。 */
  private settings: PixivPreviewSettings
  /** 所有设置变更订阅者。 */
  private readonly listeners = new Set<SettingsListener>()
  /** 油猴存储适配器。 */
  private readonly storage: SettingsStorage

  constructor(storage: SettingsStorage) {
    this.storage = storage
    try {
      this.settings = normalizeSettings(storage.get())
    } catch {
      this.settings = { ...DEFAULT_SETTINGS }
    }
  }

  /** 获取当前设置的只读快照。 */
  public get value(): Readonly<PixivPreviewSettings> {
    return this.settings
  }

  /** 校验、保存设置并通知所有订阅者。 */
  public save(value: unknown): void {
    this.settings = normalizeSettings(value)
    this.storage.set(this.settings)
    for (const listener of this.listeners) listener(this.settings)
  }

  /** 订阅设置变更，并返回取消订阅方法。 */
  public subscribe(listener: SettingsListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

/** 将未知的持久化数据逐项校验为可安全使用的设置。 */
export function normalizeSettings(value: unknown): PixivPreviewSettings {
  const source =
    typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)
      : {}
  const preloadWorkers = source.preloadWorkers
  const cacheWorks = source.cacheWorks
  const showDelay = source.showDelay

  return {
    preloadEnabled:
      typeof source.preloadEnabled === 'boolean'
        ? source.preloadEnabled
        : DEFAULT_SETTINGS.preloadEnabled,
    preloadWorkers:
      Number.isInteger(preloadWorkers) &&
      Number(preloadWorkers) >= 1 &&
      Number(preloadWorkers) <= 8
        ? Number(preloadWorkers)
        : DEFAULT_SETTINGS.preloadWorkers,
    cacheWorks:
      Number.isInteger(cacheWorks) &&
      Number(cacheWorks) >= 1 &&
      Number(cacheWorks) <= 10
        ? Number(cacheWorks)
        : DEFAULT_SETTINGS.cacheWorks,
    showDelay:
      Number.isInteger(showDelay) &&
      Number(showDelay) >= 0 &&
      Number(showDelay) <= 2000
        ? Number(showDelay)
        : DEFAULT_SETTINGS.showDelay,
    imageQuality:
      source.imageQuality === 'original' || source.imageQuality === 'regular'
        ? source.imageQuality
        : DEFAULT_SETTINGS.imageQuality,
  }
}
