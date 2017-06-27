import {MarkerLocation} from './markerLocation.model';
import {Watertype} from '../watertype/watertype.model';
import {Waterschap} from '../waterschap/waterschap.model';
export class Marker {
    markerLocation: MarkerLocation;
    watertype: Watertype;
    watertypeKrw: Watertype;
    waterschap: Waterschap;
    lastTakenSample: any;

    public static fromJSON(obj): Marker {
        const marker = new Marker();
        marker.markerLocation = obj.location;
        marker.watertype = obj.watertype;
        marker.watertypeKrw = obj.watertypeKrw;
        marker.waterschap = obj.waterschap;
        marker.lastTakenSample = obj.lastTakenSample;
        return marker;
    }
}
