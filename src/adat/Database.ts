/// <reference path='../../lib/illa/Event.ts'/>
/// <reference path='../../lib/illa/EventHandler.ts'/>

/// <reference path='VersionDescriptor.ts'/>

module adat {
	export class Database extends illa.EventHandler {
	
		static EVENT_BLOCKED = 'adat_Database_EVENT_BLOCKED';
		static EVENT_NOT_SUPPORTED = 'adat_Database_EVENT_NOT_SUPPORTED';
		static EVENT_OPEN_ERROR = 'adat_Database_EVENT_OPEN_ERROR';
		static EVENT_OPEN_SUCCESS = 'adat_Database_EVENT_OPEN_SUCCESS';
		static EVENT_ERROR = 'adat_Database_EVENT_ERROR';
		static EVENT_ABORT = 'adat_Database_EVENT_ABORT';
	
		private openRequest: IDBOpenDBRequest;
		private database: IDBDatabase;
		private isOpen = false;
		
		constructor(private name: string, private versionDescriptors: VersionDescriptor[]) {
			super();
		}
		
		open(): void {
			if (!Database.isSupported()) {
				illa.Log.warn(this.name, 'IndexedDB not supported.');
			
				new illa.Event(Database.EVENT_NOT_SUPPORTED, this).dispatch();
				return;
			}
			
			this.openRequest = indexedDB.open(this.getName(), this.getVersion());
			this.openRequest.onblocked = illa.bind(this.onBlocked, this);
			this.openRequest.onerror = illa.bind(this.onOpenError, this);
			this.openRequest.onupgradeneeded = illa.bind(this.onUpgradeNeeded, this);
			this.openRequest.onsuccess = illa.bind(this.onOpenSuccess, this);
		}
		
		initDatabase() {
			if (!this.database) {
				this.database = <IDBDatabase>this.openRequest.result;
				this.database.onerror = illa.bind(this.onDatabaseError, this);
				this.database.onabort = illa.bind(this.onDatabaseAbort, this);
			}
		}
		
		onBlocked(e: Event) {
			illa.Log.warn(this.name, 'Database upgrade blocked, waiting for other instances...');
			
			new illa.Event(Database.EVENT_BLOCKED, this).dispatch();
		}
		
		onOpenError(e: ErrorEvent) {
			illa.Log.error(this.name, 'Could not open database.');
			
			new illa.Event(Database.EVENT_OPEN_ERROR, this).dispatch();
		}
		
		onUpgradeNeeded(e: IDBVersionChangeEvent) {
			illa.Log.info(this.name, 'Upgrading database...');
			
			if (e.newVersion > this.getVersion()) {
				throw this.name + ' Invalid database version: ' + e.newVersion;
			}
			
			var transaction = this.openRequest.transaction;
			transaction.onabort = illa.bind(this.onUpgradeTransactionAbort, this);
			transaction.onerror = illa.bind(this.onUpgradeTransactionError, this);
			
			this.initDatabase();
			
			for (var version = 1, n = this.versionDescriptors.length; version <= n; version++) {
				var newVersion = this.getVersionDescriptor(version);
				
				if (e.oldVersion < version) {
					var prevVersion = version > 1 ? this.getVersionDescriptor(version - 1) : null;
					
					newVersion.applyTo(transaction, this.database, prevVersion);
				}
			}
		}
		
		onOpenSuccess(e: Event) {
			illa.Log.info(this.name, 'Database opened successfully.');
			
			this.isOpen = true;
			this.initDatabase();
			
			new illa.Event(Database.EVENT_OPEN_SUCCESS, this).dispatch();
		}
		
		onUpgradeTransactionAbort(e) {
			illa.Log.warn(this.name, 'Aborted upgrade transaction.');
		}
		
		onUpgradeTransactionError(e: ErrorEvent) {
			illa.Log.error(this.name, 'Upgrade transaction error:', e.message);
		}
		
		onDatabaseError(e: ErrorEvent) {
			illa.Log.error(this.name, 'Database error:', e.message);
			
			new illa.Event(Database.EVENT_ERROR, this).dispatch();
		}
		
		onDatabaseAbort(e) {
			illa.Log.warn(this.name, 'Aborted on database.');
			
			new illa.Event(Database.EVENT_ABORT, this).dispatch();
		}
		
		static isSupported(): boolean {
			return !!illa.GLOBAL.indexedDB;
		}
		
		static deleteDatabase(name: string): void {
			if (this.isSupported()) {
				indexedDB.deleteDatabase(name);
			}
		}
		
		getName() { return this.name }
		getVersionDescriptors() { return this.versionDescriptors }
		getVersionDescriptor(version: number) { return this.versionDescriptors[version - 1] }
		getCurrentVersionDescriptor() { return this.getVersionDescriptor(this.getVersion()) }
		getVersion() { return this.getVersionDescriptors().length }
		getIDBDatabase() { return this.database }
		getIsOpen() { return this.isOpen }
	}
}