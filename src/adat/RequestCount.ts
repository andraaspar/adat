/// <reference path='CursorDirection.ts'/>
/// <reference path='Request.ts'/>

module adat {
	export class RequestCount<K, V> extends Request<K, V> {
		
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: number) => void, private key?: K) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [objectStore.count(this.key)];
		}
		
		onSuccess(e: Event) {
			super.onSuccess(e);
			this.onResult(<number>(<IDBRequest>e.target).result);
		}
		
		getTypeName(): string { return 'Count' }
		getMode(): TransactionMode { return TransactionMode.READONLY }
	}
}