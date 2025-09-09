import * as Fingerprint from './fingerprint.js'
import { hash, randomInt } from './util.js'

/** @import * as API from './api.js' */

const maxKicks = 500

/**
 * Calcualte configuration parameters given the maximum number of items to store
 * and the error rate.
 *
 * @param {number} capacity Maximum number of items to store.
 * @param {number} errorRate Error rate (between 0 and 1).
 * @param {number} [bucketSize] The number of fingerprints each bucket can store.
 */
export const configure = (capacity, errorRate, bucketSize) => {
  bucketSize = bucketSize ?? 4
  const size = Math.ceil(capacity / bucketSize / 0.955)
  const fingerprintSize = computeFingerpintSize(bucketSize, errorRate)
  return { size, bucketSize, fingerprintSize }
}

/**
 * Compute the optimal fingerprint size in bytes for a given bucket size
 * and a false positive rate.
 *
 * @param  {number} size Filter bucket size.
 * @param  {number} rate Error rate, i.e. 'false positive' rate, targeted by the filter.
 * @returns {number} The optimal fingerprint size in bytes.
 */
const computeFingerpintSize = (size, rate) => {
  const f = Math.ceil(Math.log2(1 / rate) + Math.log2(2 * size))
  return Math.ceil(f / 8)
}

/**
 * @param {API.BucketList} buckets
 * @param {number} [fingerprintSize]
 */
export const create = (buckets, fingerprintSize) =>
  new Filter(buckets, fingerprintSize)

/** @implements {API.Filter} */
class Filter {
  #fingerprintSize
  /** @type {API.BucketList} */
  #buckets

  /**
   * @param {API.BucketList} buckets
   * @param {number} [fingerprintSize]
   */
  constructor (buckets, fingerprintSize) {
    this.#fingerprintSize = fingerprintSize ?? 2
    if (!Number.isInteger(this.#fingerprintSize)) {
      throw new TypeError('fingerprint size is not an integer')
    }
    if (this.#fingerprintSize > 4) {
      throw new RangeError('fingerprint size is larger than 4 bytes')
    }
    this.#buckets = buckets
  }

  /**
   * @param {Uint8Array} input
   */
  async add (input) {
    const buckets = this.#buckets
    const fingerprint = Fingerprint.create(input, this.#fingerprintSize)
    const j = hash(input) % buckets.size
    const k = (j ^ hash(fingerprint.bytes())) % buckets.size
    if (await buckets.get(j).add(fingerprint) || await buckets.get(k).add(fingerprint)) {
      return true
    }
    const rand = [j, k]
    let i = rand[randomInt(0, rand.length - 1)]
    /** @type {API.Fingerprint|null} */
    let f = fingerprint
    for (let n = 0; n < maxKicks; n++) {
      f = await buckets.get(i).swap(f)
      if (!f) {
        throw new Error('swap in full bucket did not return a fingerprint')
      }
      i = (i ^ hash(f.bytes())) % this.#buckets.size
      if (await buckets.get(i).add(f)) {
        return true
      }
    }
    return false
  }

  /**
   * @param {Uint8Array} input
   */
  async has (input) {
    const buckets = this.#buckets
    const fingerprint = Fingerprint.create(input, this.#fingerprintSize)
    const j = hash(input) % buckets.size
    const inJ = await buckets.get(j).has(fingerprint)
    if (inJ) {
      return inJ
    }
    const k = (j ^ hash(fingerprint.bytes())) % buckets.size
    const inK = await buckets.get(k).has(fingerprint)
    return inK
  }

  /**
   * @param {Uint8Array} input
   */
  async delete (input) {
    const buckets = this.#buckets
    const fingerprint = Fingerprint.create(input, this.#fingerprintSize)
    const j = hash(input) % buckets.size
    const inJ = await buckets.get(j).delete(fingerprint)
    if (inJ) {
      return inJ
    }
    const k = (j ^ hash(fingerprint.bytes())) % buckets.size
    const inK = await buckets.get(k).delete(fingerprint)
    return inK
  }
}
