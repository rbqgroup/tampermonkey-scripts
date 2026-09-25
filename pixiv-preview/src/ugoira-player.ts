/** 可由播放器主动释放的单帧图像资源。 */
export interface UgoiraFrameResource {
  close(): void
}

interface UgoiraPlayerOptions {
  frameCount: number
  getDelay(index: number): number
  loadFrame(index: number): Promise<UgoiraFrameResource>
  drawFrame(frame: UgoiraFrameResource): void
  schedule(callback: () => void, delay: number): number
  cancelSchedule(handle: number): void
  onError(error: unknown): void
}

interface PendingFrame {
  index: number
  frame: UgoiraFrameResource
}

/** 按像素预算计算保持比例的解码尺寸。 */
export function calculateDecodeSize(
  width: number,
  height: number,
  maxPixels: number
): { width: number; height: number } {
  if (width * height <= maxPixels) return { width, height }
  const scale = Math.sqrt(maxPixels / (width * height))
  return {
    width: Math.max(1, Math.floor(width * scale)),
    height: Math.max(1, Math.floor(height * scale)),
  }
}

/** 串行加载并播放 Ugoira 帧，任意时刻最多持有一个已显示帧。 */
export class UgoiraPlayer {
  private readonly options: UgoiraPlayerOptions
  private currentFrame?: UgoiraFrameResource
  private currentIndex = 0
  private pendingFrame?: Promise<PendingFrame>
  private scheduleHandle?: number
  private disposed = false

  constructor(options: UgoiraPlayerOptions) {
    this.options = options
  }

  public async start(): Promise<void> {
    if (this.disposed || this.currentFrame) return
    const frame = await this.options.loadFrame(0)
    if (this.disposed) {
      frame.close()
      return
    }
    this.showFrame({ index: 0, frame })
  }

  public dispose(): void {
    if (this.disposed) return
    this.disposed = true
    if (this.scheduleHandle !== undefined) {
      this.options.cancelSchedule(this.scheduleHandle)
      this.scheduleHandle = undefined
    }
    this.currentFrame?.close()
    this.currentFrame = undefined
    const pending = this.pendingFrame
    this.pendingFrame = undefined
    void pending?.then(({ frame }) => frame.close(), () => undefined)
  }

  private readonly advance = (): void => {
    if (this.disposed || !this.pendingFrame) return
    const pending = this.pendingFrame
    void pending.then(
      (next) => {
        if (this.pendingFrame === pending) this.pendingFrame = undefined
        if (!this.disposed) this.showFrame(next)
      },
      (error) => {
        if (this.pendingFrame === pending) this.pendingFrame = undefined
        if (!this.disposed) {
          this.dispose()
          this.options.onError(error)
        }
      }
    )
  }

  private showFrame(next: PendingFrame): void {
    this.options.drawFrame(next.frame)
    this.currentFrame?.close()
    this.currentFrame = next.frame
    this.currentIndex = next.index
    if (this.options.frameCount <= 1) return

    this.prepareNextFrame()
    this.scheduleHandle = this.options.schedule(
      this.advance,
      Math.max(1, this.options.getDelay(next.index))
    )
  }

  private prepareNextFrame(): void {
    const index = (this.currentIndex + 1) % this.options.frameCount
    const pending = this.options
      .loadFrame(index)
      .then((frame) => ({ index, frame }))
    this.pendingFrame = pending
    void pending.catch(() => undefined)
  }
}
