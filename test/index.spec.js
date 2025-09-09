import crypto from 'node:crypto'
import assert from 'node:assert'
import { describe, it } from 'node:test'
import { Filter as CuckooFilter } from '../src/index.js'

describe('Cuckoo Filter', () => {
  it('should add 1,500 keys', async () => {
    /** @type {Uint8Array[]} */
    const keys = []
    const cuckoo = new CuckooFilter({ size: 1500, bucketSize: 6, fingerprintSize: 4 })

    for (let i = 0; i < 1500; i++) {
      const rand = crypto.randomBytes(36)
      keys.push(rand)
      const result = await cuckoo.add(rand)
      assert(result)
    }

    for (const key of keys) {
      const result = await cuckoo.contains(key)
      assert(result)
    }
  })
})
