import Request from './Request'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import TransactionMode from './TransactionMode'

export default class RequestDelete<K extends IDBKeyRange | IDBValidKey, V> extends Request<K, V> {

	constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private key: K) {
		super(objectStoreDescriptor)
	}
	
	processInternal(objectStore: IDBObjectStore): IDBRequest[] {
		return [objectStore.delete(this.key)]
	}
	
	getTypeName(): string { return 'Delete' }
	getMode(): TransactionMode { return TransactionMode.READWRITE }
}