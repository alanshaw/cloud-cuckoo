export interface Fingerprint {
  bytes: () => Uint8Array
  equals: (other: Fingerprint) => boolean
}

export interface Bucket {
  add: (f: Fingerprint) => Promise<boolean>
  contains: (f: Fingerprint) => Promise<boolean>
  remove: (f: Fingerprint) => Promise<boolean>
  swap: (f: Fingerprint) => Promise<Fingerprint|null>
}

export interface BucketList {
  get: (i: number) => Bucket
}

export interface Filter {
  add: (input: Uint8Array) => Promise<boolean>
  contains: (input: Uint8Array) => Promise<boolean>
  remove: (input: Uint8Array) => Promise<boolean>
}
