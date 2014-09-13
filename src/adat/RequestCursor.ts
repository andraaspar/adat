/// <reference path='CursorDirection.ts'/>
/// <reference path='Request.ts'/>

module adat {
	export class RequestCursor<K, V> extends Request<K, V> {
		
		private result: V[] = [];
		
		constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: V[]) => void, private range?: IDBKeyRange, private direction = CursorDirection.NEXT) {
			super(objectStoreDescriptor);
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] {
			return [objectStore.openCursor(this.range, CursorDirection[this.direction].toLowerCase())];
		}
		
		onSuccess(e: Event) {
			var cursor = <IDBCursorWithValue>(<IDBRequest>e.target).result;
			if (cursor) {
				if (this.keepValue(cursor.value)) {
					this.result.push(cursor.value);
				}
				cursor.continue();
			} else {
				super.onSuccess(e);
				this.onResult(this.result);
			}
		}
		
		keepValue(value: V): boolean {
			return true;
		}
		
		getTypeName(): string { return 'Cursor' }
		getMode(): TransactionMode { return TransactionMode.READONLY }
	}
}