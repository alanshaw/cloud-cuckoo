import { equalBytes } from './util.js'
import * as FNV32 from './fnv32.js'

/** @import * as API from './api.js' */

/** @implements {API.Fingerprint} */
export class Fingerprint {
  /** @type {Uint8Array} */
  #bytes

  /**
   * @param {Uint8Array} input
   * @param {number} [size]
   */
  constructor (input, size) {
    size = size ?? 2
    if (!(input instanceof Uint8Array)) {
      throw new TypeError('fingerprint bytes is not instance of Uint8Array')
    }
    if (!Number.isInteger(size)) {
      throw new TypeError('fingerprint size is not an integer')
    }
    if (size > 4) {
      throw new RangeError('fingerprint size is larger than 4 bytes')
    }
    const digest = FNV32.digest1a(input)
    const bytes = new Uint8Array(size)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = digest[i]
    }
    if (bytes.length === 0) {
      bytes[0] = 7
    }
    this.#bytes = bytes
  }

  bytes () {
    return this.#bytes
  }

  /** @param {API.Fingerprint} other */
  equals (other) {
    return equalBytes(this.#bytes, other.bytes())
  }
}
