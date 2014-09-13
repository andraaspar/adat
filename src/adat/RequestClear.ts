/// <reference path='Request.ts'/>

module adat {
	export class RequestClear<K, V> extends Request<K, V> {
	
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [objectStore.clear()];
		}
		
		getTypeName(): string { return 'Clear' }
		getMode(): TransactionMode { return TransactionMode.READWRITE }
	}
}