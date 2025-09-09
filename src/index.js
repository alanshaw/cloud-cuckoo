import { List } from './bucket.js'
import { Fingerprint } from './fingerprint.js'
import { hash, randomInt } from './util.js'

/** @import * as API from './api.js' */

const maxCuckooCount = 500

/** @implements {API.Filter} */
export class Filter {
  #size
  #bucketSize
  #fingerprintSize
  /** @type {API.BucketList} */
  #buckets

  /**
   * @param {object} [options]
   * @param {number} [options.size]
   * @param {number} [options.bucketSize]
   * @param {number} [options.fingerprintSize]
   * @param {API.BucketList} [options.buckets]
   */
  constructor (options) {
    this.#bucketSize = options?.bucketSize ?? 4
    this.#fingerprintSize = options?.fingerprintSize ?? 2
    this.#size = options?.size ?? (1 << 18) / this.#bucketSize

    if (!Number.isInteger(this.#size)) {
      throw new TypeError('filter Size is not an integer')
    }
    if (!Number.isInteger(this.#fingerprintSize)) {
      throw new TypeError('fingerprint size is not an integer')
    }
    if (this.#fingerprintSize > 4) {
      throw new RangeError('fingerprint size is larger than 4 bytes')
    }
    if (!Number.isInteger(this.#bucketSize)) {
      throw new TypeError('bucket size is not an integer')
    }

    this.#buckets = options?.buckets ?? new List(this.#size, this.#bucketSize)
  }

  /**
   * @param {Uint8Array} input
   */
  async add (input) {
    if (!(input instanceof Uint8Array)) {
      throw new TypeError('input is not a Uint8Array')
    }
    const fingerprint = new Fingerprint(input, this.#fingerprintSize)
    const j = hash(input) % this.#size
    const k = (j ^ hash(fingerprint.bytes())) % this.#size
    const buckets = this.#buckets
    if (await buckets.get(j).add(fingerprint) || await buckets.get(k).add(fingerprint)) {
      return true
    }
    const rand = [j, k]
    let i = rand[randomInt(0, rand.length - 1)]
    /** @type {API.Fingerprint|null} */
    let f = fingerprint
    for (let n = 0; n < maxCuckooCount; n++) {
      f = await buckets.get(i).swap(f)
      if (!f) {
        throw new Error('swap in full bucket did not return a fingerprint')
      }
      i = (i ^ hash(f.bytes())) % this.#size
      if (await buckets.get(i).add(f)) {
        return true
      }
    }
    return false
  }

  /**
   * @param {Uint8Array} input
   */
  async contains (input) {
    if (!(input instanceof Uint8Array)) {
      throw new TypeError('input is not a Uint8Array')
    }
    const buckets = this.#buckets
    const fingerprint = new Fingerprint(input, this.#fingerprintSize)
    const j = hash(input) % this.#size
    const inJ = await buckets.get(j).contains(fingerprint)
    if (inJ) {
      return inJ
    }
    const k = (j ^ hash(fingerprint.bytes())) % this.#size
    const inK = await buckets.get(k).contains(fingerprint)
    return inK
  }

  /**
   * @param {Uint8Array} input
   */
  async remove (input) {
    if (!(input instanceof Uint8Array)) {
      throw new TypeError('input is not a Uint8Array')
    }
    const buckets = this.#buckets
    const fingerprint = new Fingerprint(input, this.#fingerprintSize)
    const j = hash(input) % this.#size
    const inJ = await buckets.get(j).remove(fingerprint)
    if (inJ) {
      return inJ
    }
    const k = (j ^ hash(fingerprint.bytes())) % this.#size
    const inK = await buckets.get(k).remove(fingerprint)
    return inK
  }
}
