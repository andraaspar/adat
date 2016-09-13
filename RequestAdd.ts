import Request from './Request'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import TransactionMode from './TransactionMode'

export default class RequestAdd<K extends IDBKeyRange | IDBValidKey, V> extends Request<K, V> {

	constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private value: V, private key?: K) {
		super(objectStoreDescriptor)
	}
	
	processInternal(objectStore: IDBObjectStore): IDBRequest[] {
		return [objectStore.add(this.value, this.key)]
	}
	
	getTypeName(): string { return 'Add' }
	getMode(): TransactionMode { return TransactionMode.READWRITE }
}