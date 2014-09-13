module test1 {
	export class SomeValue {
		id: number;
		time = new Date().getTime();
		timeString = new Date().toUTCString();
	}
}