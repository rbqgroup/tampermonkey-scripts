import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DEFAULT_SETTINGS,
  normalizeSettings,
  SettingsStore,
} from '../src/settings.ts'

test('异常持久化设置逐项回退到默认值', () => {
  assert.deepEqual(
    normalizeSettings({
      preloadEnabled: 'yes',
      preloadWorkers: 9,
      cacheWorks: 0,
      showDelay: -1,
      imageQuality: 'large',
    }),
    DEFAULT_SETTINGS
  )
})

test('合法设置保持用户选择', () => {
  assert.deepEqual(
    normalizeSettings({
      preloadEnabled: false,
      preloadWorkers: 8,
      cacheWorks: 10,
      showDelay: 0,
      imageQuality: 'original',
    }),
    {
      preloadEnabled: false,
      preloadWorkers: 8,
      cacheWorks: 10,
      showDelay: 0,
      imageQuality: 'original',
    }
  )
})

test('保存设置时持久化并通知订阅者', () => {
  let persisted: unknown = { preloadWorkers: 2 }
  const store = new SettingsStore({
    get: () => persisted,
    set: (value) => {
      persisted = value
    },
  })
  const changes: number[] = []
  store.subscribe((settings) => changes.push(settings.preloadWorkers))

  store.save({ ...store.value, preloadWorkers: 6 })

  assert.equal(store.value.preloadWorkers, 6)
  assert.deepEqual(persisted, { ...DEFAULT_SETTINGS, preloadWorkers: 6 })
  assert.deepEqual(changes, [6])
})

test('读取持久化设置失败时使用默认值', () => {
  const store = new SettingsStore({
    get: () => {
      throw new Error('存储不可用')
    },
    set: () => undefined,
  })

  assert.deepEqual(store.value, DEFAULT_SETTINGS)
})
