import Request from './Request'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import TransactionMode from './TransactionMode'

export default class RequestClear<K extends IDBKeyRange | IDBValidKey, V> extends Request<K, V> {

	constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>) {
		super(objectStoreDescriptor)
	}
	
	processInternal(objectStore: IDBObjectStore): IDBRequest[] {
		return [objectStore.clear()]
	}
	
	getTypeName(): string { return 'Clear' }
	getMode(): TransactionMode { return TransactionMode.READWRITE }
}