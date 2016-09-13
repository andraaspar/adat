import Request from './Request'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import TransactionMode from './TransactionMode'

export default class RequestCount<K extends IDBKeyRange | IDBValidKey, V> extends Request<K, V> {
	
	constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: number) => void, private key?: K) {
		super(objectStoreDescriptor)
	}
	
	processInternal(objectStore: IDBObjectStore): IDBRequest[] {
		return [objectStore.count(this.key)]
	}
	
	onSuccess(e: Event) {
		super.onSuccess(e)
		this.onResult(<number>(<IDBRequest>e.target).result)
	}
	
	getTypeName(): string { return 'Count' }
	getMode(): TransactionMode { return TransactionMode.READONLY }
}