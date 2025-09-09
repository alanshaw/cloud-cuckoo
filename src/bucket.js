import { randomInt } from './util.js'

/** @import * as API from './api.js' */

/** @implements {API.Bucket} */
export class Bucket {
  /** @type {Array<API.Fingerprint|null>} */
  #contents

  /**
   * @param {number} size
   */
  constructor (size) {
    if (!Number.isInteger(size)) {
      throw TypeError('bucket size is not an integer')
    }
    this.#contents = Array(size).fill(null)
  }

  /**
   * @param {API.Fingerprint} fingerprint
   */
  async contains (fingerprint) {
    for (const f of this.#contents) {
      if (f && fingerprint.equals(f)) {
        return true
      }
    }
    return false
  }

  /**
   * @param {API.Fingerprint} fingerprint
   */
  async add (fingerprint) {
    for (let i = 0; i < this.#contents.length; i++) {
      if (!this.#contents[i]) {
        this.#contents[i] = fingerprint
        return true
      }
    }
    return false
  }

  /**
   * @param {API.Fingerprint} fingerprint
   */
  async swap (fingerprint) {
    const i = randomInt(0, this.#contents.length - 1)
    const current = this.#contents[i]
    this.#contents[i] = fingerprint
    return current
  }

  /**
   * @param {API.Fingerprint} fingerprint
   */
  async remove (fingerprint) {
    for (const [i, f] of this.#contents.entries()) {
      if (f && fingerprint.equals(f)) {
        this.#contents[i] = f
        return true
      }
    }
    return false
  }
}

export class List {
  /** @type {API.Bucket[]} */
  #buckets
  #size
  #bucketSize

  /**
   * @param {number} size List size
   * @param {number} bucketSize Bucket size
   */
  constructor (size, bucketSize) {
    this.#buckets = []
    this.#size = size
    this.#bucketSize = bucketSize
  }

  /**
   * @param {number} i
   */
  get (i) {
    if (i >= this.#size) {
      throw new RangeError('bucket index is greater than list size')
    }
    let b = this.#buckets[i]
    if (!b) {
      b = new Bucket(this.#bucketSize)
      this.#buckets[i] = b
    }
    return b
  }
}
