import assert from 'node:assert/strict'
import test from 'node:test'

import {
  UgoiraPlayer,
  calculateDecodeSize,
  type UgoiraFrameResource,
} from '../src/ugoira-player.ts'

class FakeFrame implements UgoiraFrameResource {
  public closed = false
  public readonly index: number

  constructor(index: number) {
    this.index = index
  }

  public close(): void {
    this.closed = true
  }
}

test('超大帧按像素预算等比缩小', () => {
  assert.deepEqual(calculateDecodeSize(6000, 4000, 2_000_000), {
    width: 1732,
    height: 1154,
  })
  assert.deepEqual(calculateDecodeSize(1200, 800, 2_000_000), {
    width: 1200,
    height: 800,
  })
})

test('切帧后关闭旧帧，销毁时关闭当前帧并取消定时器', async () => {
  const frames = [new FakeFrame(0), new FakeFrame(1)]
  const drawn: number[] = []
  const scheduled: Array<() => void> = []
  let cancelled = false
  const player = new UgoiraPlayer({
    frameCount: frames.length,
    getDelay: (index) => [80, 120][index],
    loadFrame: async (index) => frames[index],
    drawFrame: (frame) => drawn.push((frame as FakeFrame).index),
    schedule: (callback) => {
      scheduled.push(callback)
      return 1
    },
    cancelSchedule: () => {
      cancelled = true
    },
    onError: () => undefined,
  })

  await player.start()
  assert.deepEqual(drawn, [0])
  assert.equal(frames[0].closed, false)
  assert.equal(scheduled.length, 1)

  scheduled.shift()?.()
  await new Promise((resolve) => setTimeout(resolve, 0))
  assert.deepEqual(drawn, [0, 1])
  assert.equal(frames[0].closed, true)

  player.dispose()
  assert.equal(frames[1].closed, true)
  assert.equal(cancelled, true)
})

test('解码未完成时不会排入第二个解码任务', async () => {
  let resolveSecond: ((frame: FakeFrame) => void) | undefined
  let loads = 0
  const scheduled: Array<() => void> = []
  const player = new UgoiraPlayer({
    frameCount: 2,
    getDelay: () => 60,
    loadFrame: (index) => {
      loads++
      if (index === 0) return Promise.resolve(new FakeFrame(0))
      return new Promise((resolve) => {
        resolveSecond = resolve
      })
    },
    drawFrame: () => undefined,
    schedule: (callback) => {
      scheduled.push(callback)
      return scheduled.length
    },
    cancelSchedule: () => undefined,
    onError: () => undefined,
  })

  await player.start()
  const advance = scheduled.shift()
  advance?.()
  advance?.()
  assert.equal(loads, 2)

  resolveSecond?.(new FakeFrame(1))
  await new Promise((resolve) => setTimeout(resolve, 0))
  player.dispose()
})

test('显示首帧后立即预解码下一帧', async () => {
  let loads = 0
  const player = new UgoiraPlayer({
    frameCount: 2,
    getDelay: () => 100,
    loadFrame: async (index) => {
      loads++
      return new FakeFrame(index)
    },
    drawFrame: () => undefined,
    schedule: () => 1,
    cancelSchedule: () => undefined,
    onError: () => undefined,
  })

  await player.start()
  assert.equal(loads, 2)
  player.dispose()
})
