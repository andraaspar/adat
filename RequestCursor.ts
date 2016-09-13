import {
	isUndefinedOrNull
} from '@andraaspar/illa/Type'

import Request from './Request'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import TransactionMode from './TransactionMode'
import CursorDirection from './CursorDirection'

export default class RequestCursor<K extends IDBKeyRange | IDBValidKey, V> extends Request<K, V> {
	
	private result: V[] = []
	private resultFilter: (key: K, value: V) => boolean
	
	constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: V[]) => void, private range?: IDBKeyRange, private direction = CursorDirection.NEXT) {
		super(objectStoreDescriptor)
	}
	
	processInternal(objectStore: IDBObjectStore): IDBRequest[] {
		return [objectStore.openCursor(this.range, CursorDirection[this.direction].toLowerCase())]
	}
	
	onSuccess(e: Event) {
		var cursor = <IDBCursorWithValue>(<IDBRequest>e.target).result
		if (cursor) {
			if (isUndefinedOrNull(this.resultFilter) || this.resultFilter(cursor.key, cursor.value)) {
				this.result.push(cursor.value)
			}
			cursor.continue()
		} else {
			super.onSuccess(e)
			this.onResult(this.result)
		}
	}
	
	getTypeName(): string { return 'Cursor' }
	getMode(): TransactionMode { return TransactionMode.READONLY }
	getResultFilter() { return this.resultFilter }
	setResultFilter(value: (key: K, value: V) => boolean): RequestCursor<K, V> { this.resultFilter = value; return this }
}