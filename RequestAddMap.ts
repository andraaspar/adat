import Map from '@andraaspar/illa/Map'

import Request from './Request'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import TransactionMode from './TransactionMode'

export default class RequestAddMap<K extends IDBKeyRange | IDBValidKey, V> extends Request<K, V> {

	constructor(objectStoreDescriptor: ObjectStoreDescriptor<K, V>, private values: Map<K, V>) {
		super(objectStoreDescriptor)
	}
	
	processInternal(objectStore: IDBObjectStore): IDBRequest[] {
		var result: IDBRequest[] = []
		var keys = this.values.getKeys()
		var values = this.values.getValues()
		for (var i = 0, n = keys.length; i < n; i++) {
			result.push(objectStore.add(values[i], keys[i]))
		}
		return result
	}
	
	getTypeName(): string { return 'AddMap' }
	getMode(): TransactionMode { return TransactionMode.READWRITE }
}