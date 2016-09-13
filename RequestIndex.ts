import {
	getKeyOfValue
} from '@andraaspar/illa/ObjectUtil'

import Request from './Request'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import IndexDescriptor from './IndexDescriptor'

export default class RequestIndex<K extends IDBKeyRange | IDBValidKey, V> extends Request<any, V> {

	constructor(objectStoreDescriptor: ObjectStoreDescriptor<any, V>, private indexDescriptor: IndexDescriptor<K, V>) {
		super(objectStoreDescriptor)
	}
	
	getIndexFromObjectStore(objectStore: IDBObjectStore): IDBIndex {
		var indexName = getKeyOfValue(this.getObjectStoreDescriptor().getIndexDescriptors(), this.indexDescriptor)
		return objectStore.index(indexName)
	}
}