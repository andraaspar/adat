/// <reference path='Request.ts'/>

module adat {
	export class RequestAddMultiple<K, V> extends Request<K, V> {
	
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private values: V[]) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			var result: IDBRequest[] = [];
			for (var i = 0, n = this.values.length; i < n; i++) {
				result.push(objectStore.add(this.values[i]));
			}
			return result;
		}
		
		getTypeName(): string { return 'AddMultiple' }
		getMode(): TransactionMode { return TransactionMode.READWRITE }
	}
}