/// <reference path='../../lib/illa/EventHandler.ts'/>

/// <reference path='Database.ts'/>
/// <reference path='Request.ts'/>
/// <reference path='TransactionMode.ts'/>

module adat {
	export class Transaction extends illa.EventHandler {
	
		static EVENT_ABORT = 'adat_Transaction_EVENT_ABORT';
		static EVENT_ERROR = 'adat_Transaction_EVENT_ERROR';
		static EVENT_COMPLETE = 'adat_Transaction_EVENT_COMPLETE';
	
		private transaction: IDBTransaction;
		private name = '';
		
		constructor(private database: Database, private requests: Request<any, any>[]) {
			super();
		}
		
		process(): Transaction {
			if (this.database.getIsOpen()) {
				this.processInternal();
			} else {
				this.database.open();
				this.database.addEventCallback(Database.EVENT_OPEN_SUCCESS, this.processInternal, this);
			}
			return this;
		}
		
		processInternal(): void {
			this.transaction = this.database.getIDBDatabase().transaction(this.getObjectStoreNames(), Transaction.getModeValue(this.getMode()));
			this.transaction.onabort = illa.bind(this.onAbort, this);
			this.transaction.onerror = illa.bind(this.onError, this);
			this.transaction.oncomplete = illa.bind(this.onComplete, this);
			
			for (var i = 0, n = this.requests.length; i < n; i++) {
				var request = this.requests[i];
				var objectStoreName = illa.ObjectUtil.getKeyOfValue(
					this.database.getCurrentVersionDescriptor().getObjectStoreDescriptors(),
					request.getObjectStoreDescriptor());
				request.process(this.transaction.objectStore(objectStoreName));
			}
		}
		
		getObjectStoreNames(): string[] {
			var result: string[] = [];
			var osds: ObjectStoreDescriptor<any, any>[] = [];
			
			for (var i = 0, n = this.requests.length; i < n; i++) {
				var osd = this.requests[i].getObjectStoreDescriptor();
				if (illa.ArrayUtil.indexOf(osds, osd) == -1) {
					osds.push(osd);
					result.push(illa.ObjectUtil.getKeyOfValue(this.database.getCurrentVersionDescriptor().getObjectStoreDescriptors(), osd));
				}
			}
			
			return result;
		}
		
		getMode(): TransactionMode {
			var result = TransactionMode.READONLY;
			for (var i = 0, n = this.requests.length; i < n; i++) {
				var mode = this.requests[i].getMode();
				if (mode > result) {
					result = mode;
					break; // There is but one level above READONLY
				}
			}
			return result;
		}
		
		static getModeValue(mode: TransactionMode): string {
			switch (mode) {
				case TransactionMode.READONLY:
					return 'readonly';
				case TransactionMode.READWRITE:
					return 'readwrite';
			}
			return '';
		}
		
		onAbort(e) {
			illa.Log.warn('Aborted transaction.');
			
			new illa.Event(Transaction.EVENT_ABORT, this).dispatch();
		}
		
		onError(e: ErrorEvent) {
			illa.Log.error('Transaction error:', e.message);
			
			new illa.Event(Transaction.EVENT_ERROR, this).dispatch();
		}
		
		onComplete(e: Event) {
			illa.Log.infoIf(this.name, 'Transaction complete.');
			
			new illa.Event(Transaction.EVENT_COMPLETE, this).dispatch();
		}
		
		getDatabase() { return this.database }
		getRequests() { return this.requests }
		getIDBTransaction() { return this.transaction }
		setName(value: string): Transaction { this.name = value; return this }
		getName() { return this.name }
	}
}