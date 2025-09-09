# cloud-cuckoo

Implementation of a Cuckoo Filter where filter and bucket operations are async, allowing bucket data to be stored in databases.

## Install

```sh
npm install cloud-cuckoo
```

## Usage

```js
import * as CuckooFilter from 'cloud-cuckoo'
import { List } from 'cloud-cuckoo/bucket/memory'

const capacity = 1_000_000 // Maximum items the filter can store.
const errorRate = 0.01     // 1% false positive rate.

// Get optimal configuration for the filter, given the capacity and error rate.
const {
  size,
  bucketSize,
  fingerprintSize
} = CuckooFilter.configure(capacity, errorRate)

const buckets = List.create({ size, bucketSize })
const filter = CuckooFilter.create(buckets, { fingerprintSize })

const item = new Uint8Array([1, 2, 3])
const added = await filter.add(item)
const exists = await filter.has(item)
const removed = await filter.delete(item)
```

For real life usage, you'll want to implement a `BucketList`, where the returned buckets implement `Bucket`. These should be backed by an async datastore. Your implementation should be passed as the `buckets` parameter to `create(...)`.

## Contributing

Feel free to join in. All welcome. [Open an issue](https://github.com/alanshaw/cloud-cuckoo/issues)!

## License

Licensed under [MIT](https://github.com/alanshaw/cloud-cuckoo/blob/main/LICENSE.md)
