/// <reference path='../../lib/illa/ObjectUtil.ts'/>

/// <reference path='Request.ts'/>

module adat {
	export class RequestIndex<K, V, IK> extends Request<K, V> {
	
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private indexDescriptor: IndexDescriptor) {
			super(objectStoreDescriptor);
		}
		
		getIndexFromObjectStore(objectStore: IDBObjectStore): IDBIndex {
			var indexName = illa.ObjectUtil.getKeyOfValue(this.getObjectStoreDescriptor().getIndexDescriptors(), this.indexDescriptor);
			return objectStore.index(indexName);
		}
	}
}