/// <reference path='../../lib/illa/_module.ts'/>

/// <reference path='CursorDirection.ts'/>
/// <reference path='RequestIndex.ts'/>

module adat {
	export class RequestIndexCursor<K, V> extends RequestIndex<K, V> {
		
		private result: V[] = [];
		private resultFilter: (key: K, value: V) => boolean;
		
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<any, V>, indexDescriptor: IndexDescriptor<K, V>, private onResult: (r: V[]) => void, private range?: IDBKeyRange, private direction = CursorDirection.NEXT) {
			super(objectStoreDescriptor, indexDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [this.getIndexFromObjectStore(objectStore).openCursor(this.range, CursorDirection[this.direction].toLowerCase())];
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
		
		getTypeName(): string { return 'IndexCursor' }
		getMode(): TransactionMode { return TransactionMode.READONLY }
		getResultFilter() { return this.resultFilter }
		setResultFilter(value: (key: K, value: V) => boolean): RequestIndexCursor<K, V> { this.resultFilter = value; return this }
	}
}