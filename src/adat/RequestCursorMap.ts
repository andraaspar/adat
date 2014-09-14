/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='../../lib/illa/Map.ts'/>

/// <reference path='CursorDirection.ts'/>
/// <reference path='Request.ts'/>

module adat {
	export class RequestCursorMap<K, V> extends Request<K, V> {
		
		private result = new illa.Map<K, V>();
		private resultFilter: (key: K, value: V) => boolean;
		
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: illa.Map<K, V>) => void, private range?: IDBKeyRange, private direction = CursorDirection.NEXT) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [objectStore.openCursor(this.range, CursorDirection[this.direction].toLowerCase())];
		}
		
		onSuccess(e: Event) {
			var cursor = <IDBCursorWithValue>(<IDBRequest>e.target).result;
			if (cursor) {
				if (illa.isUndefinedOrNull(this.resultFilter) || this.resultFilter(cursor.key, cursor.value)) {
					this.result.set(cursor.key, cursor.value);
				}
				cursor.continue();
			} else {
				super.onSuccess(e);
				this.onResult(this.result);
			}
		}
		
		getTypeName(): string { return 'CursorMap' }
		getMode(): TransactionMode { return TransactionMode.READONLY }
		getResultFilter() { return this.resultFilter }
		setResultFilter(value: (key: K, value: V) => boolean): RequestCursorMap<K, V> { this.resultFilter = value; return this }
	}
}