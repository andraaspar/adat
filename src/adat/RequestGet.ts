/// <reference path='CursorDirection.ts'/>
/// <reference path='Request.ts'/>

module adat {
	export class RequestGet<K, V> extends Request<K, V> {
		
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: V) => void, private key?: K) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [objectStore.get(this.key)];
		}
		
		onSuccess(e: Event) {
			super.onSuccess(e);
			this.onResult(<V>(<IDBRequest>e.target).result);
		}
		
		getTypeName(): string { return 'Get' }
		getMode(): TransactionMode { return TransactionMode.READONLY }
	}
}