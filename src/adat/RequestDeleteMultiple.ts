/// <reference path='Request.ts'/>

module adat {
	export class RequestDeleteMultiple<K, V> extends Request<K, V> {
	
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private keys: K[]) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			var result: IDBRequest[] = [];
			for (var i = 0, n = this.keys.length; i < n; i++) {
				result.push(objectStore.delete(this.keys[i]));
			}
			return result;
		}
		
		getTypeName(): string { return 'DeleteMultiple' }
		getMode(): TransactionMode { return TransactionMode.READWRITE }
	}
}