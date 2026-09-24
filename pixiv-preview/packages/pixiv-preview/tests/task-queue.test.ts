import assert from 'node:assert/strict'
import test from 'node:test'

import { consumeTasks } from '../src/task-queue.ts'

test('worker 按任务顺序领取且不超过并发上限', async () => {
  const started: number[] = []
  let active = 0
  let maxActive = 0

  await consumeTasks(
    [0, 1, 2, 3, 4, 5],
    4,
    async (task) => {
      started.push(task)
      active++
      maxActive = Math.max(maxActive, active)
      await new Promise((resolve) => setTimeout(resolve, 5))
      active--
    },
    new AbortController().signal
  )

  assert.deepEqual(started, [0, 1, 2, 3, 4, 5])
  assert.equal(maxActive, 4)
})

test('单个任务失败后继续消费剩余任务', async () => {
  const completed: number[] = []

  await consumeTasks(
    [0, 1, 2],
    2,
    async (task) => {
      if (task === 1) throw new Error('加载失败')
      completed.push(task)
    },
    new AbortController().signal
  )

  assert.deepEqual(completed, [0, 2])
})

test('取消后不再领取新任务', async () => {
  const controller = new AbortController()
  const started: number[] = []
  let releaseWorkers: (() => void) | undefined
  const workersBlocked = new Promise<void>((resolve) => {
    releaseWorkers = resolve
  })

  const consuming = consumeTasks(
    [0, 1, 2, 3],
    2,
    async (task) => {
      started.push(task)
      await workersBlocked
    },
    controller.signal
  )
  await new Promise((resolve) => setTimeout(resolve, 0))
  controller.abort()
  releaseWorkers?.()
  await consuming

  assert.deepEqual(started, [0, 1])
})
