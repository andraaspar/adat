/// <reference path='CursorDirection.ts'/>
/// <reference path='Request.ts'/>

module adat {
	export class RequestCountRange<K, V> extends Request<K, V> {
		
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: number) => void, private range?: IDBKeyRange) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [objectStore.count(this.range)];
		}
		
		onSuccess(e: Event) {
			super.onSuccess(e);
			this.onResult(<number>(<IDBRequest>e.target).result);
		}
		
		getTypeName(): string { return 'CountRange' }
		getMode(): TransactionMode { return TransactionMode.READONLY }
	}
}