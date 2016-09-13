import IllaEvent from '@andraaspar/illa/Event'
import EventHandler from '@andraaspar/illa/EventHandler'
import Log from '@andraaspar/illa/Log'
import {
	indexOf
} from '@andraaspar/illa/ArrayUtil'
import {
	bind
} from '@andraaspar/illa/FunctionUtil'
import {
	getKeyOfValue
} from '@andraaspar/illa/ObjectUtil'
import {
	isUndefinedOrNull
} from '@andraaspar/illa/Type'

import Database from './Database'
import ObjectStoreDescriptor from './ObjectStoreDescriptor'
import Request from './Request'
import TransactionMode from './TransactionMode'

export default class Transaction extends EventHandler {

	static EVENT_ABORT = 'adat_Transaction_EVENT_ABORT'
	static EVENT_ERROR = 'adat_Transaction_EVENT_ERROR'
	static EVENT_COMPLETE = 'adat_Transaction_EVENT_COMPLETE'

	private transaction: IDBTransaction
	private name = ''
	
	constructor(private database: Database, private requests: Request<any, any>[], private mode?: TransactionMode) {
		super()
	}
	
	process(): Transaction {
		if (this.database.getIsOpen()) {
			this.processInternal()
		} else {
			this.database.open()
			this.database.addEventCallback(Database.EVENT_OPEN_SUCCESS, this.processInternal, this)
		}
		return this
	}
	
	processInternal(): void {
		if (!this.transaction) {
			this.transaction = this.database.getIDBDatabase().transaction(this.getObjectStoreNames(), Transaction.getModeValue(this.getMode()))
			this.transaction.onabort = bind(this.onAbort, this)
			this.transaction.onerror = bind(this.onError, this)
			this.transaction.oncomplete = bind(this.onComplete, this)
		}
		
		for (var i = 0, n = this.requests.length; i < n; i++) {
			var request = this.requests[i]
			var objectStoreName = getKeyOfValue(
				this.database.getCurrentVersionDescriptor().getObjectStoreDescriptors(),
				request.getObjectStoreDescriptor())
			request.process(this.transaction.objectStore(objectStoreName))
		}
	}
	
	getObjectStoreNames(): string[] {
		var result: string[] = []
		var osds: ObjectStoreDescriptor<any, any>[] = []
		
		for (var i = 0, n = this.requests.length; i < n; i++) {
			var osd = this.requests[i].getObjectStoreDescriptor()
			if (indexOf(osds, osd) == -1) {
				osds.push(osd)
				result.push(getKeyOfValue(this.database.getCurrentVersionDescriptor().getObjectStoreDescriptors(), osd))
			}
		}
		
		return result
	}
	
	getMode(): TransactionMode {
		if (isUndefinedOrNull(this.mode)) {
			return this.getModeFromRequests()
		} else {
			return this.mode
		}
	}
	
	getModeFromRequests(): TransactionMode {
		var result = TransactionMode.READONLY
		for (var i = 0, n = this.requests.length; i < n; i++) {
			var mode = this.requests[i].getMode()
			if (mode > result) {
				result = mode
				break; // There is but one level above READONLY
			}
		}
		return result
	}
	
	static getModeValue(mode: TransactionMode): string {
		switch (mode) {
			case TransactionMode.READONLY:
				return 'readonly'
			case TransactionMode.READWRITE:
				return 'readwrite'
		}
		return ''
	}
	
	onAbort(e) {
		Log.warn('Aborted transaction.')
		
		new IllaEvent(Transaction.EVENT_ABORT, this).dispatch()
	}
	
	onError(e: ErrorEvent) {
		Log.error('Transaction error:', e.message)
		
		new IllaEvent(Transaction.EVENT_ERROR, this).dispatch()
	}
	
	onComplete(e: Event) {
		Log.infoIf(this.name, 'Transaction complete.')
		
		new IllaEvent(Transaction.EVENT_COMPLETE, this).dispatch()
	}
	
	getDatabase() { return this.database }
	getRequests() { return this.requests }
	setRequests(value: Request<any, any>[]): Transaction { this.requests = value; return this }
	getIDBTransaction() { return this.transaction }
	setName(value: string): Transaction { this.name = value; return this }
	getName() { return this.name }
}