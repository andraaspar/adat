/// <reference path='../../lib/illa/ArrayUtil.ts'/>
/// <reference path='../../lib/illa/EventHandler.ts'/>

/// <reference path='TransactionMode.ts'/>

module adat {
	export class Request<K, V> extends illa.EventHandler {
	
		static EVENT_SUCCESS = 'adat_Request_EVENT_SUCCESS';
		
		private requests: IDBRequest[];
		private name = '';
		
		constructor(private objectStoreDescriptor: ObjectStoreDescriptor<K, V>) {
			super();
		}
		
		processInternal(objectStore: IDBObjectStore): IDBRequest[] { throw 'Unimplemented.' }
		getTypeName(): string { throw 'Unimplemented.' }
		getMode(): TransactionMode { throw 'Unimplemented.' }
		
		process(objectStore: IDBObjectStore): void {
			this.requests = this.processInternal(objectStore);
			
			for (var i = 0, n = this.requests.length; i < n; i++) {
				var request = this.requests[i];
				request.onerror = illa.bind(this.onError, this);
				request.onsuccess = illa.bind(this.onSuccess, this);
			}
		}
		
		onError(e: ErrorEvent) {
			illa.Log.error(this.name, this.getTypeName(), this.getIDBRequestID(<IDBRequest>e.target), e.message);
		}
		
		onSuccess(e: Event) {
			illa.Log.infoIf(this.name, this.getTypeName(), this.getIDBRequestID(<IDBRequest>e.target), 'Successful.');
		}
		
		getIDBRequestID(request: IDBRequest): number {
			return illa.ArrayUtil.indexOf(this.requests, request);
		}
		
		getObjectStoreDescriptor() { return this.objectStoreDescriptor }
		setName(value: string): Request<K, V> { this.name = value; return this }
		getName() { return this.name }
		getRequests() { return this.requests }
		getRequest(id: number) { return this.requests[id] }
	}
}