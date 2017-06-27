package marker;

import location.Location;
import waterschap.Waterschap;
import watertype.Watertype;

import java.util.Date;

/**
 * @author Dylan de Wit
 * @version 1.0, 19-6-2017
 */
public class Marker {

    private Location location;
    private Watertype watertype;
    private Watertype watertypeKrw;
    private Waterschap waterschap;
    private String lastTakenSample;

    public Marker(Location location, Watertype watertype, Watertype watertypeKrw,
                  Waterschap waterschap, String lastTakenSample) {
        this.location = location;
        this.watertype = watertype;
        this.watertypeKrw = watertypeKrw;
        this.waterschap = waterschap;
        this.lastTakenSample = lastTakenSample;
    }

    public Marker() {}

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Watertype getWatertype() {
        return watertype;
    }

    public void setWatertype(Watertype watertype) {
        this.watertype = watertype;
    }

    public Watertype getWatertypeKrw() {
        return watertypeKrw;
    }

    public void setWatertypeKrw(Watertype watertypeKrw) {
        this.watertypeKrw = watertypeKrw;
    }

    public Waterschap getWaterschap() {
        return waterschap;
    }

    public void setWaterschap(Waterschap waterschap) {
        this.waterschap = waterschap;
    }

    public String getLastTakenSample() {
        return lastTakenSample;
    }

    public void setLastTakenSample(String lastTakenSample) {
        this.lastTakenSample = lastTakenSample;
    }
}
