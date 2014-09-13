/// <reference path='../../lib/illa/Map.ts'/>

/// <reference path='Request.ts'/>

module adat {
	export class RequestPutMap<K, V> extends Request<K, V> {
	
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private values: illa.Map<K, V>) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			var result: IDBRequest[] = [];
			var keys = this.values.getKeys();
			var values = this.values.getValues();
			for (var i = 0, n = keys.length; i < n; i++) {
				result.push(objectStore.put(values[i], keys[i]));
			}
			return result;
		}
		
		getTypeName(): string { return 'PutMap' }
		getMode(): TransactionMode { return TransactionMode.READWRITE }
	}
}