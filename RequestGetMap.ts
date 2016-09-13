import Map from '@andraaspar/illa/Map'

import Request from './Request'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import TransactionMode from './TransactionMode'

export default class RequestGetMap<K extends IDBKeyRange | IDBValidKey, V> extends Request<K, V> {
	
	constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private onResult: (r: Map<K, V>) => void, private key: K) {
		super(objectStoreDescriptor)
	}
	
	processInternal(objectStore: IDBObjectStore): IDBRequest[] {
		return [objectStore.get(this.key)]
	}
	
	onSuccess(e: Event) {
		super.onSuccess(e)
		var request = <IDBRequest>e.target
		var result = new Map<K, V>([this.key], [<V>request.result])
		this.onResult(result)
	}
	
	getTypeName(): string { return 'GetMap' }
	getMode(): TransactionMode { return TransactionMode.READONLY }
}