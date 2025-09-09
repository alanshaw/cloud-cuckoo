import { randomInt } from '../../util.js'

/** @import * as API from '../../api.js' */

/**
 * Create an in-memory bucket implementation for testing/demos.
 *
 * @param {number} [size]
 */
export const create = size => {
  size = size ?? 4
  if (!Number.isInteger(size)) {
    throw new TypeError('bucket size is not an integer')
  }
  const contents = Array(size).fill(null)
  return from(contents)
}

/**
 * Create an in-memory bucket implementation from an array of existing
 * fingerprints.
 *
 * @param {Array<API.Fingerprint|null>} contents
 */
export const from = contents => new MemoryBucket(contents)

/** @implements {API.Bucket} */
class MemoryBucket {
  /** @type {Array<API.Fingerprint|null>} */
  #contents

  /**
   * @param {Array<API.Fingerprint|null>} contents
   */
  constructor (contents) {
    this.#contents = contents
  }

  /**
   * @param {API.Fingerprint} fingerprint
   */
  async has (fingerprint) {
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
  async delete (fingerprint) {
    for (const [i, f] of this.#contents.entries()) {
      if (f && fingerprint.equals(f)) {
        this.#contents[i] = f
        return true
      }
    }
    return false
  }
}
