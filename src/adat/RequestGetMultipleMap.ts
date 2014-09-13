/// <reference path='../../lib/illa/Map.ts'/>

/// <reference path='Request.ts'/>

module adat {
	export class RequestGetMultipleMap<K, V> extends Request<K, V> {
		
		private resultCount = 0;
		private result = new illa.Map<K, V>();
		
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: illa.Map<K, V>) => void, private keys: K[]) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			var result: IDBRequest[] = [];
			for (var i = 0, n = this.keys.length; i < n; i++) {
				result.push(objectStore.get(this.keys[i]));
			}
			return result;
		}
		
		onSuccess(e: Event) {
			super.onSuccess(e);
			this.resultCount++;
			var request = <IDBRequest>e.target;
			this.result.set(this.keys[this.getIDBRequestID(request)], <V>request.result);
			if (this.resultCount == this.getRequests().length) {
				this.onResult(this.result);
			}
		}
		
		getTypeName(): string { return 'GetMultipleMap' }
		getMode(): TransactionMode { return TransactionMode.READONLY }
	}
}