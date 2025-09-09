/** 32 bit offset_basis = 2,166,136,261 = 0x811C9DC5 */
const offsetBasis = 2_166_136_261

/**
 * @see https://tools.ietf.org/html/draft-eastlake-fnv-12#page-6
 * @param {number} hash unsigned 32 bit integer
 * @returns {Uint8Array} 32 bit little endian
 */
const encodeInt32LE = hash => {
  const buf = new Uint8Array(4)
  buf[0] = hash & 0xff
  buf[1] = hash >>> 8 & 0xff
  buf[2] = hash >>> 16 & 0xff
  buf[3] = hash >>> 24 & 0xff
  return buf
}

/**
 * @param {Uint8Array} bytes
 * @returns {Uint8Array}
 */
export const digest1a = bytes => {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError('data is not an instance of Uint8Array')
  }
  let hash = offsetBasis
  for (let i = 0; i < bytes.length; i++) {
    hash = hash ^ bytes[i]
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }
  return encodeInt32LE(hash >>> 0)
}
