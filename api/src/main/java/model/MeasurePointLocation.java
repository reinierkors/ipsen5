package model;

/**
 * Created by Kruishoop on 23-5-2017.
 */
public class MeasurePointLocation {
    private String code;
    private String waterschap;
    private int longitude;
    private int latitude;

    public MeasurePointLocation() {

    }

    public String getCode() {
        return code;
    }

    public String getWaterschap() {
        return waterschap;
    }

    public int getLongitude() {
        return longitude;
    }

    public int getLatitude() {
        return latitude;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setWaterschap(String waterschap) {
        this.waterschap = waterschap;
    }

    public void setLongitude(int longitude) {
        this.longitude = longitude;
    }

    public void setLatitude(int latitude) {
        this.latitude = latitude;
    }
}
