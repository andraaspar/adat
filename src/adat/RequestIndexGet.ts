/// <reference path='../../lib/illa/_module.ts'/>

/// <reference path='RequestIndex.ts'/>

module adat {
	export class RequestIndexGet<K, V> extends RequestIndex<K, V> {
		
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<any, V>, indexDescriptor: IndexDescriptor<K, V>, private onResult: (r: V) => void, private key?: K) {
			super(objectStoreDescriptor, indexDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [this.getIndexFromObjectStore(objectStore).get(this.key)];
		}
		
		onSuccess(e: Event) {
			super.onSuccess(e);
			this.onResult(<V>(<IDBRequest>e.target).result);
		}
		
		getTypeName(): string { return 'IndexGet' }
		getMode(): TransactionMode { return TransactionMode.READONLY }
	}
}