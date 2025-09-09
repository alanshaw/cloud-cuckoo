# cloud-cuckoo

Implementation of a Cuckoo Filter where filter and bucket operations are async, allowing bucket data to be stored in databases.

## Install

```sh
npm install cloud-cuckoo
```

## Usage

```js
import { Filter } from 'cloud-cuckoo'
import { List } from 'cloud-cuckoo/bucket'

const size = 16
const bucketSize = 4
const fingerprintSize = 2

const cuckoo = new Filter({
  size,
  bucketSize,
  fingerprintSize,
  buckets: new List(size, bucketSize)
})

const item = new Uint8Array([1, 2, 3])
const added = await cuckoo.add(item)
const exists = await cuckoo.contains(item)
const removed = await cuckoo.remove(item)
```

For real life usage, you'll want to implement `BucketList`, where the returned buckets implement `Bucket`. These should be backed by an async datastore.
