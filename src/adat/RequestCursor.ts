/// <reference path='../../lib/illa/_module.ts'/>

/// <reference path='CursorDirection.ts'/>
/// <reference path='Request.ts'/>

module adat {
	export class RequestCursor<K, V> extends Request<K, V> {
		
		private result: V[] = [];
		private resultFilter: (key: K, value: V) => boolean;
		
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: V[]) => void, private range?: IDBKeyRange, private direction = CursorDirection.NEXT) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [objectStore.openCursor(this.range, CursorDirection[this.direction].toLowerCase())];
		}
		
		onSuccess(e: Event) {
			var cursor = <IDBCursorWithValue>(<IDBRequest>e.target).result;
			if (cursor) {
				if (illa.isUndefinedOrNull(this.resultFilter) || this.resultFilter(cursor.key, cursor.value)) {
					this.result.push(cursor.value);
				}
				cursor.continue();
			} else {
				super.onSuccess(e);
				this.onResult(this.result);
			}
		}
		
		getTypeName(): string { return 'Cursor' }
		getMode(): TransactionMode { return TransactionMode.READONLY }
		getResultFilter() { return this.resultFilter }
		setResultFilter(value: (key: K, value: V) => boolean): RequestCursor<K, V> { this.resultFilter = value; return this }
	}
}