export default class IndexDescriptor<K, V> {

	constructor(private keyPath: string, private isUnique = false, private isMultiEntry = false) {
		
	}
	
	applyTo(objectStore: IDBObjectStore, name: string, prev: IndexDescriptor<any, any>): void {
		if (!this.getEquals(prev)) {
			if (prev) {
				this.removeFrom(objectStore, name)
			}
			objectStore.createIndex(name, this.getKeyPath(), {unique: this.getIsUnique(), multiEntry: this.getIsMultiEntry()})
		}
	}
	
	removeFrom(objectStore: IDBObjectStore, name: string): void {
		objectStore.deleteIndex(name)
	}
	
	getEquals(other: IndexDescriptor<any, any>): boolean {
		var result = false
		
		if (other instanceof IndexDescriptor &&
			this.getKeyPath() === other.getKeyPath() &&
			this.getIsUnique() === other.getIsUnique() &&
			this.getIsMultiEntry() === other.getIsMultiEntry()) {
			
			result = true
		}
		
		return result
	}
	
	getKeyPath() { return this.keyPath }
	getIsUnique() { return this.isUnique }
	getIsMultiEntry() { return this.isMultiEntry }
}