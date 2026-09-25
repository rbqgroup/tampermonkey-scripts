import assert from 'node:assert/strict'
import test from 'node:test'

import { getImageUrl } from '../src/image-url.ts'
import type { Artwork } from '../src/types.ts'

const artwork = {
  urls: {
    regular: 'https://i.pximg.net/123_p0_master1200.jpg',
    original: 'https://i.pximg.net/123_p0.jpg',
  },
} as Artwork

test('根据清晰度从对应地址生成目标页 URL', () => {
  assert.equal(
    getImageUrl(artwork, 2, 'regular'),
    'https://i.pximg.net/123_p2_master1200.jpg'
  )
  assert.equal(
    getImageUrl(artwork, 2, 'original'),
    'https://i.pximg.net/123_p2.jpg'
  )
})
