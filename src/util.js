/** @param {Uint8Array} bytes */
export const hash = bytes => {
  let hash = 5381
  for (let i = 0; i < bytes.length; i++) {
    hash = (((hash << 5) >>> 0) + hash) + bytes[i]
  }
  return hash
}

/**
 * @param {number} min
 * @param {number} max
 */
export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min

/**
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 */
export const equalBytes = (a, b) => {
  if (a === b) {
    return true
  }
  if (a.byteLength !== b.byteLength) {
    return false
  }
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}
