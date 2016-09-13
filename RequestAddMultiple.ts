import Request from './Request'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import TransactionMode from './TransactionMode'

export default class RequestAddMultiple<K extends IDBKeyRange | IDBValidKey, V> extends Request<K, V> {

	constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private values: V[]) {
		super(objectStoreDescriptor)
	}
	
	processInternal(objectStore: IDBObjectStore): IDBRequest[] {
		var result: IDBRequest[] = []
		for (var i = 0, n = this.values.length; i < n; i++) {
			result.push(objectStore.add(this.values[i]))
		}
		return result
	}
	
	getTypeName(): string { return 'AddMultiple' }
	getMode(): TransactionMode { return TransactionMode.READWRITE }
}