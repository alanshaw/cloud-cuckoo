export interface Fingerprint {
  bytes: () => Uint8Array
  equals: (other: Fingerprint) => boolean
}

export interface Bucket {
  add: (f: Fingerprint) => Promise<boolean>
  has: (f: Fingerprint) => Promise<boolean>
  delete: (f: Fingerprint) => Promise<boolean>
  swap: (f: Fingerprint) => Promise<Fingerprint|null>
}

export interface BucketList {
  size: number
  get: (i: number) => Bucket
}

export interface Filter {
  add: (input: Uint8Array) => Promise<boolean>
  has: (input: Uint8Array) => Promise<boolean>
  delete: (input: Uint8Array) => Promise<boolean>
}
