import { Notification } from './notification'
import {
  DEFAULT_SETTINGS,
  SettingsStore,
  type PixivPreviewSettings,
} from './settings'

/** 通过油猴菜单打开并编辑脚本设置。 */
export class SettingsPanel {
  /** 设置面板遮罩容器。 */
  private readonly root = document.createElement('div')
  /** 设置表单。 */
  private readonly form = document.createElement('form')

  constructor(
    private readonly store: SettingsStore,
    private readonly notification: Notification
  ) {
    this.root.className = 'ppv-settings-backdrop'
    this.root.innerHTML = `
      <div class="ppv-settings-panel" role="dialog" aria-modal="true" aria-labelledby="ppv-settings-title">
        <div class="ppv-settings-header">
          <strong id="ppv-settings-title">Pixiv Preview 设置</strong>
          <button type="button" class="ppv-settings-close" aria-label="关闭">×</button>
        </div>
        <div class="ppv-settings-fields"></div>
        <div class="ppv-settings-actions">
          <button type="button" class="ppv-settings-defaults">恢复默认值</button>
          <button type="submit" class="ppv-settings-save">保存</button>
        </div>
      </div>`
    this.form.className = 'ppv-settings-form'
    const panel = this.root.firstElementChild as HTMLElement
    const fields = panel.querySelector('.ppv-settings-fields') as HTMLElement
    fields.append(
      this.createCheckbox('preloadEnabled', '启用后台预加载'),
      this.createNumber('preloadWorkers', '预加载 worker 数', 1, 8),
      this.createNumber('cacheWorks', '缓存作品数', 1, 10),
      this.createNumber('showDelay', '悬浮延迟（毫秒）', 0, 2000),
      this.createQuality()
    )
    this.form.append(...panel.childNodes)
    panel.append(this.form)
    document.body.append(this.root)
    this.bindEvents()
    GM_registerMenuCommand('Pixiv Preview 设置', this.open)
  }

  /** 创建布尔设置控件。 */
  private createCheckbox(name: string, labelText: string): HTMLLabelElement {
    const label = document.createElement('label')
    label.className = 'ppv-settings-row ppv-settings-checkbox-row'
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.name = name
    label.append(input, labelText)
    return label
  }

  /** 创建带范围限制的数字设置控件。 */
  private createNumber(
    name: string,
    labelText: string,
    min: number,
    max: number
  ): HTMLLabelElement {
    const label = document.createElement('label')
    label.className = 'ppv-settings-row'
    const text = document.createElement('span')
    text.textContent = labelText
    const input = document.createElement('input')
    input.type = 'number'
    input.name = name
    input.min = String(min)
    input.max = String(max)
    input.step = '1'
    input.required = true
    label.append(text, input)
    return label
  }

  /** 创建图片清晰度选择控件。 */
  private createQuality(): HTMLLabelElement {
    const label = document.createElement('label')
    label.className = 'ppv-settings-row'
    const text = document.createElement('span')
    text.textContent = '图片清晰度'
    const select = document.createElement('select')
    select.name = 'imageQuality'
    select.innerHTML = `
      <option value="regular">标准（regular）</option>
      <option value="original">原图（original）</option>`
    label.append(text, select)
    return label
  }

  /** 绑定面板内交互。 */
  private bindEvents(): void {
    this.root.addEventListener('click', (event) => {
      if (
        event.target === this.root ||
        (event.target instanceof Element &&
          event.target.closest('.ppv-settings-close'))
      ) {
        this.close()
      }
    })
    this.root
      .querySelector('.ppv-settings-defaults')
      ?.addEventListener('click', () => this.fill(DEFAULT_SETTINGS))
    this.form.addEventListener('submit', (event) => {
      event.preventDefault()
      if (!this.form.reportValidity()) return
      this.store.save(this.read())
      this.notification.show('设置已保存', 'success')
      this.close()
    })
    window.addEventListener(
      'keydown',
      (event) => {
        if (
          event.code === 'Escape' &&
          this.root.classList.contains('is-open')
        ) {
          event.preventDefault()
          event.stopPropagation()
          this.close()
        }
      },
      true
    )
  }

  /** 从表单读取通过浏览器校验的设置。 */
  private read(): PixivPreviewSettings {
    const data = new FormData(this.form)
    return {
      preloadEnabled: data.get('preloadEnabled') === 'on',
      preloadWorkers: Number(data.get('preloadWorkers')),
      cacheWorks: Number(data.get('cacheWorks')),
      showDelay: Number(data.get('showDelay')),
      imageQuality:
        data.get('imageQuality') === 'original' ? 'original' : 'regular',
    }
  }

  /** 将设置写入表单控件。 */
  private fill(settings: Readonly<PixivPreviewSettings>): void {
    const get = (name: string) =>
      this.form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement
    ;(get('preloadEnabled') as HTMLInputElement).checked =
      settings.preloadEnabled
    get('preloadWorkers').value = String(settings.preloadWorkers)
    get('cacheWorks').value = String(settings.cacheWorks)
    get('showDelay').value = String(settings.showDelay)
    get('imageQuality').value = settings.imageQuality
  }

  /** 显示设置面板并填入当前值。 */
  private open = (): void => {
    this.fill(this.store.value)
    this.root.classList.add('is-open')
    ;(this.form.elements.namedItem('preloadWorkers') as HTMLInputElement).focus()
  }

  /** 关闭设置面板。 */
  private close(): void {
    this.root.classList.remove('is-open')
  }
}
