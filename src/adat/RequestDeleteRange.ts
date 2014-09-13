/// <reference path='Request.ts'/>

module adat {
	export class RequestDeleteRange<K, V> extends Request<K, V> {
	
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private range: IDBKeyRange) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [objectStore.delete(this.range)];
		}
		
		getTypeName(): string { return 'DeleteRange' }
		getMode(): TransactionMode { return TransactionMode.READWRITE }
	}
}