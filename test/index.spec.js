import crypto from 'node:crypto'
import assert from 'node:assert'
import { describe, it } from 'node:test'
import * as CuckooFilter from '../src/index.js'
import { List as BucketList } from '../src/bucket/memory/index.js'

describe('Cuckoo Filter', () => {
  it('should add 1,500 keys', async () => {
    /** @type {Uint8Array[]} */
    const keys = []
    const buckets = BucketList.create(1500, 6)
    const cuckoo = CuckooFilter.create(buckets, 4)

    for (let i = 0; i < 3500; i++) {
      const rand = crypto.randomBytes(36)
      keys.push(rand)
      const result = await cuckoo.add(rand)
      assert(result)
    }

    for (const key of keys) {
      const result = await cuckoo.has(key)
      assert(result)
    }
  })
})
