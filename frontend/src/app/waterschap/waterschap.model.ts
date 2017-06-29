export class Waterschap {
	id: number;
	name: string;
	address: string;
	houseNumber: number;
	zipCode: string;
	location: string;
	phoneNumber: string;

	public static fromJSON(obj: any): Waterschap {
		const ws: Waterschap = new Waterschap();
		ws.id = obj.id;
		ws.name = obj.name;
		ws.address = obj.address;
		ws.houseNumber = obj.houseNumber;
		ws.zipCode = obj.zipCode;
		ws.location = obj.location;
		ws.phoneNumber = obj.phoneNumber;
		return ws;
	}
}
