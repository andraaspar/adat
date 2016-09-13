import Map from '@andraaspar/illa/Map'

import Request from './Request'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import TransactionMode from './TransactionMode'

export default class RequestGet<K extends IDBKeyRange | IDBValidKey, V> extends Request<K, V> {
	
	constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: V) => void, private key?: K) {
		super(objectStoreDescriptor)
	}
	
	processInternal(objectStore: IDBObjectStore): IDBRequest[] {
		return [objectStore.get(this.key)]
	}
	
	onSuccess(e: Event) {
		super.onSuccess(e)
		this.onResult(<V>(<IDBRequest>e.target).result)
	}
	
	getTypeName(): string { return 'Get' }
	getMode(): TransactionMode { return TransactionMode.READONLY }
}