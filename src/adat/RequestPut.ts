/// <reference path='Request.ts'/>

module adat {
	export class RequestPut<K, V> extends Request<K, V> {
	
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private value: V, private key?: K) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [objectStore.put(this.value, this.key)];
		}
		
		getTypeName(): string { return 'Put' }
		getMode(): TransactionMode { return TransactionMode.READWRITE }
	}
}