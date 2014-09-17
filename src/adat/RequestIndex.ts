/// <reference path='../../lib/illa/ObjectUtil.ts'/>

/// <reference path='Request.ts'/>

module adat {
	export class RequestIndex<K, V> extends Request<any, V> {
	
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<any, V>, private indexDescriptor: IndexDescriptor<K, V>) {
			super(objectStoreDescriptor);
		}
		
		getIndexFromObjectStore(objectStore: IDBObjectStore): IDBIndex {
			var indexName = illa.ObjectUtil.getKeyOfValue(this.getObjectStoreDescriptor().getIndexDescriptors(), this.indexDescriptor);
			return objectStore.index(indexName);
		}
	}
}