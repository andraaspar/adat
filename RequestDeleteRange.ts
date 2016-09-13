import Request from './Request'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import TransactionMode from './TransactionMode'

export default class RequestDeleteRange<K extends IDBKeyRange | IDBValidKey, V> extends Request<K, V> {

	constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private range: IDBKeyRange) {
		super(objectStoreDescriptor)
	}
	
	processInternal(objectStore: IDBObjectStore): IDBRequest[] {
		return [objectStore.delete(this.range)]
	}
	
	getTypeName(): string { return 'DeleteRange' }
	getMode(): TransactionMode { return TransactionMode.READWRITE }
}