/// <reference path='CursorDirection.ts'/>
/// <reference path='Request.ts'/>

module adat {
	export class RequestGetMultiple<K, V> extends Request<K, V> {
		
		private result: V[] = [];
		
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: V[]) => void, private keys: K[]) {
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
			var count = this.result.push(<V>(<IDBRequest>e.target).result);
			if (count == this.getRequests().length) {
				this.onResult(this.result);
			}
		}
		
		getTypeName(): string { return 'GetMultiple' }
		getMode(): TransactionMode { return TransactionMode.READONLY }
	}
}