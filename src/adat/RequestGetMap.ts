/// <reference path='../../lib/illa/Map.ts'/>

/// <reference path='Request.ts'/>

module adat {
	export class RequestGetMap<K, V> extends Request<K, V> {
		
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: illa.Map<K, V>) => void, private key: K) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [objectStore.get(this.key)];
		}
		
		onSuccess(e: Event) {
			super.onSuccess(e);
			var request = <IDBRequest>e.target;
			var result = new illa.Map<K, V>([this.key], [<V>request.result]);
			this.onResult(result);
		}
		
		getTypeName(): string { return 'GetMap' }
		getMode(): TransactionMode { return TransactionMode.READONLY }
	}
}