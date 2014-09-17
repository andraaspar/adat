/// <reference path='../../lib/illa/ObjectUtil.ts'/>

/// <reference path='IndexDescriptor.ts'/>

module adat {
	export class ObjectStoreDescriptor<K, V> {
	
		constructor(private keyPath = '', private autoIncrement = false, private indexDescriptors: {[s: string]: IndexDescriptor<any, V>} = {}) {
			
		}
		
		applyTo(transaction: IDBTransaction, database: IDBDatabase, name: string, prev: ObjectStoreDescriptor<any, any>): void {
			if (prev && !this.getPropertiesEqual(prev)) {
			
				var objectStore = transaction.objectStore(name);
				
				this.applyIndexDescriptors(objectStore, prev);
				
			} else {
				if (prev) {
					prev.removeFrom(database, name);
				}
				var objectStore = database.createObjectStore(name, {keyPath: this.getKeyPath(), autoIncrement: this.getAutoIncrement()});
				
				this.applyIndexDescriptors(objectStore, null);
			}
		}
		
		removeFrom(database: IDBDatabase, name: string): void {
			database.deleteObjectStore(name);
		}
		
		getPropertiesEqual(other: ObjectStoreDescriptor<any, any>): boolean {
			var result = false;
			
			if (other instanceof ObjectStoreDescriptor &&
				this.getKeyPath() == other.getKeyPath() &&
				this.getAutoIncrement() == other.getAutoIncrement()) {
				
				result = true;
			}
			
			return result;
		}
		
		applyIndexDescriptors(objectStore: IDBObjectStore, prev: ObjectStoreDescriptor<any, any>): void {
			for (var key in this.indexDescriptors) {
				if (this.indexDescriptors.hasOwnProperty(key)) {
					var newIndexD = this.indexDescriptors[key];
					var prevIndexD: IndexDescriptor<any, any> = null;
					
					if (prev && prev.indexDescriptors.hasOwnProperty(key)) {
						prevIndexD = prev.indexDescriptors[key];
					}
					
					newIndexD.applyTo(objectStore, key, prevIndexD);
				}
			}
			
			if (prev) {
				for (var key in prev.indexDescriptors) {
					if (prev.indexDescriptors.hasOwnProperty(key)) {
						var prevIndexD = prev.indexDescriptors[key];
						
						if (!this.indexDescriptors.hasOwnProperty(key)) {
							prevIndexD.removeFrom(objectStore, key);
						}
					}
				}
			}
		}
		
		getKeyPath() { return this.keyPath }
		getAutoIncrement() { return this.autoIncrement }
		getIndexDescriptors() { return this.indexDescriptors }
	}
}