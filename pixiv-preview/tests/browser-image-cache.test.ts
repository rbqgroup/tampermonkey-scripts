import assert from 'node:assert/strict'
import test from 'node:test'

import { BrowserImageCache } from '../src/browser-image-cache.ts'
import type { Artwork } from '../src/types.ts'

class FakeImage {
  public static pending: FakeImage[] = []
  public alt = ''
  public complete = false
  public decoding = ''
  public fetchPriority = ''
  public naturalWidth = 0
  public onerror: (() => void) | null = null
  public onload: (() => void) | null = null
  private value = ''

  public get currentSrc(): string {
    return this.value
  }

  public get src(): string {
    return this.value
  }

  public set src(value: string) {
    this.value = value
    if (value) FakeImage.pending.push(this)
  }

  public succeed(): void {
    this.complete = true
    this.naturalWidth = 100
    this.onload?.()
  }
}

const artwork: Artwork = {
  id: '123',
  illustType: 1,
  pageCount: 2,
  width: 100,
  height: 100,
  bookmarkCount: 0,
  title: '测试作品',
  urls: { regular: 'https://i.pximg.net/123_p0.jpg' },
  tags: { tags: [] },
  bookmarkData: null,
}

test('前台等待同一页的在途预加载完成后再创建显示副本', async () => {
  const originalImage = globalThis.Image
  globalThis.Image = FakeImage as unknown as typeof Image
  FakeImage.pending = []
  try {
    const cache = new BrowserImageCache(3)
    const preloading = cache.preload(
      artwork,
      0,
      (index) => `https://i.pximg.net/123_p${index}.jpg`,
      1
    )
    await Promise.resolve()
    const foreground = cache.createImage(
      artwork.id,
      1,
      new AbortController().signal
    )
    await Promise.resolve()

    assert.equal(FakeImage.pending.length, 1)
    FakeImage.pending[0].succeed()
    await new Promise((resolve) => setTimeout(resolve, 0))
    assert.equal(FakeImage.pending.length, 2)
    FakeImage.pending[1].succeed()

    assert.ok(await foreground)
    await preloading
  } finally {
    globalThis.Image = originalImage
  }
})
