/// <reference path='Request.ts'/>

module adat {
	export class RequestDelete<K, V> extends Request<K, V> {
	
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private key: K) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [objectStore.delete(this.key)];
		}
		
		getTypeName(): string { return 'Delete' }
		getMode(): TransactionMode { return TransactionMode.READWRITE }
	}
}