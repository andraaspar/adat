/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='../../lib/illa/Log.ts'/>

/// <reference path='../../lib/jQuery.d.ts'/>

/// <reference path='../../src/adat/Transaction.ts'/>
/// <reference path='../../src/adat/RequestAdd.ts'/>
/// <reference path='../../src/adat/RequestCursor.ts'/>

/// <reference path='SomeValue.ts'/>

module test1 {
	
	export class Main {
		
		static instance = new Main();
		
		private db: adat.Database;
		private someValues: adat.ObjectStoreDescriptor<number, SomeValue>;
		private someValuesTimeIndex: adat.IndexDescriptor<number, SomeValue>;
		
		constructor() {
			jQuery(illa.bind(this.onDOMLoaded, this));
		}
		
		onDOMLoaded() {
			if (adat.Database.isSupported()) {
				this.db = new adat.Database('adat-test', [
					new adat.VersionDescriptor({
						someValues: this.someValues = new adat.ObjectStoreDescriptor<number, SomeValue>('id', true, {
							time: this.someValuesTimeIndex = new adat.IndexDescriptor<number, SomeValue>('time', true)
						})
					})
				]);
				
				var addValues = new adat.Transaction(this.db, [
					new adat.RequestAdd(this.someValues, new SomeValue()).setName('addAValue'),
					new adat.RequestCursor(this.someValues, illa.bind(this.onSomeValuesRetrieved, this), IDBKeyRange.bound(3, 5)).setName('readAllValues')
				]).setName('addValues').process();
			}
		}
		
		onSomeValuesRetrieved(values: SomeValue[]): void {
			illa.Log.info('Values retrieved...');
			for (var i = 0; i < values.length; i++) {
				var value = values[i];
				illa.Log.info('Value', 'id:', value.id, 'time:', value.time, 'timeString:', value.timeString);
			}
			illa.Log.info('End of retrieved values.');
		}
	}
}