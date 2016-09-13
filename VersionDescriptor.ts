import ObjectStoreDescriptor from './ObjectStoreDescriptor'

export default class VersionDescriptor {
	
	constructor(private objectStoreDescriptors: {[s: string]: ObjectStoreDescriptor<any, any>}) {
		
	}
	
	applyTo(transaction: IDBTransaction, database: IDBDatabase, prev: VersionDescriptor): void {
		for (var key in this.objectStoreDescriptors) {
			if (this.objectStoreDescriptors.hasOwnProperty(key)) {
				var osd = this.objectStoreDescriptors[key];
				var prevOSD = prev ? prev.getObjectStoreDescriptors()[key] || null : null;
				osd.applyTo(transaction, database, key, prevOSD);
			}
		}
		if (prev) {
			for (var key in prev.objectStoreDescriptors) {
				if (prev.objectStoreDescriptors.hasOwnProperty(key) && !this.objectStoreDescriptors.hasOwnProperty(key)) {
					var osd = this.objectStoreDescriptors[key];
					osd.removeFrom(database, key);
				}
			}
		}
	}
	
	getObjectStoreDescriptors() { return this.objectStoreDescriptors }
}