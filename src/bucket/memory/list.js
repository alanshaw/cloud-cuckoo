import * as Bucket from './bucket.js'

/** @import * as API from '../../api.js' */

/**
 * Create an in-memory bucket list implementation for testing/demos.
 *
 * @param {number} [size] The number of buckets in the list.
 * @param {number} [bucketSize] Number of fingerprints a bucket can hold.
 */
export const create = (size, bucketSize) => {
  bucketSize = bucketSize ?? 4
  size = size ?? (1 << 18) / bucketSize
  if (!Number.isInteger(size)) {
    throw new TypeError('bucket list size is not an integer')
  }
  const buckets = []
  for (let i = 0; i < size; i++) {
    buckets.push(Bucket.create(bucketSize))
  }
  return from(buckets)
}

/**
 * Create an in-memory bucket list implementation for testing/demos.
 *
 * @param {API.Bucket[]} buckets
 */
export const from = (buckets) => new MemoryBucketList(buckets)

/** @implements {API.BucketList} */
class MemoryBucketList {
  /** @type {API.Bucket[]} */
  #buckets

  /**
   * @param {API.Bucket[]} buckets
   */
  constructor (buckets) {
    this.#buckets = buckets
  }

  get size () {
    return this.#buckets.length
  }

  /**
   * @param {number} i
   */
  get (i) {
    if (i >= this.size) {
      throw new RangeError('bucket index is greater than list size')
    }
    return this.#buckets[i]
  }
}
