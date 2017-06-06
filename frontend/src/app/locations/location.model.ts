export class Location {
    id: number;
    code: string;
    description: string;
    xCoord: number;
    yCoord: number;
    latitude: number;
    longitude: number;
	waterschapId: number;
	watertypeId: number;
	watertypeKrwId: number;

    public static fromJSON(obj): Location {
        const location = new Location();
        location.id = obj.id;
        location.code = obj.code;
        location.description = obj.description;
        location.xCoord = obj.xCoord;
        location.yCoord = obj.yCoord;
        location.latitude = obj.latitude;
        location.longitude = obj.longitude;
		location.waterschapId = obj.waterschapId;
		location.watertypeId = obj.watertypeId;
		location.watertypeKrwId = obj.watertypeKrwId;
        return location;
    }
}
