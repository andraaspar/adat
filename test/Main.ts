import Database from '../Database'
import ObjectStoreDescriptor from '../ObjectStoreDescriptor'
import IndexDescriptor from '../IndexDescriptor'
import VersionDescriptor from '../VersionDescriptor'
import Transaction from '../Transaction'
import RequestAdd from '../RequestAdd'
import RequestCursor from '../RequestCursor'

import {
	bind
} from '@andraaspar/illa/FunctionUtil'
import Log from '@andraaspar/illa/Log'

import jQuery from 'jquery-ts'

import SomeValue from './SomeValue'

export default class Main {
	
	static instance = new Main();
	
	private db: Database;
	private someValues: ObjectStoreDescriptor<number, SomeValue>;
	private someValuesTimeIndex: IndexDescriptor<number, SomeValue>;
	
	constructor() {
		jQuery(bind(this.onDOMLoaded, this));
	}
	
	onDOMLoaded() {
		if (Database.isSupported()) {
			this.db = new Database('adat-test', [
				new VersionDescriptor({
					someValues: this.someValues = new ObjectStoreDescriptor<number, SomeValue>('id', true, {
						time: this.someValuesTimeIndex = new IndexDescriptor<number, SomeValue>('time', true)
					})
				})
			]);
			
			var addValues = new Transaction(this.db, [
				new RequestAdd(this.someValues, new SomeValue()).setName('addAValue'),
				new RequestCursor(this.someValues, bind(this.onSomeValuesRetrieved, this), IDBKeyRange.bound(3, 5)).setName('readAllValues')
			]).setName('addValues').process();
		}
	}
	
	onSomeValuesRetrieved(values: SomeValue[]): void {
		Log.info('Values retrieved...');
		for (var i = 0; i < values.length; i++) {
			var value = values[i];
			Log.info('Value', 'id:', value.id, 'time:', value.time, 'timeString:', value.timeString);
		}
		Log.info('End of retrieved values.');
	}
}