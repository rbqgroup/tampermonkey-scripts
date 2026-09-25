/** 在页面右上角显示互不阻塞的状态提示。 */
export class Notification {
  private readonly container = document.createElement('div')

  constructor() {
    this.container.className = 'ppv-toast-container'
    document.body.append(this.container)
  }

  /** 显示一条会自动消失的提示。 */
  public show(message: string, type: 'info' | 'success' | 'error'): void {
    const toast = document.createElement('div')
    toast.className = `ppv-toast ppv-toast-${type}`
    toast.textContent = message
    this.container.append(toast)
    window.setTimeout(() => toast.classList.add('ppv-toast-leave'), 2200)
    window.setTimeout(() => toast.remove(), 2500)
  }
}
