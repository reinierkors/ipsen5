package locations;

import java.math.BigDecimal;

/**
 * Location model
 *
 * @author Johan Kruishoop
 * @version 0.1, 24-5-2017
 */

public class Location {
    private int id;
    private String code;
    private String description;
    private int waterschap_id;
    private BigDecimal longitude;
    private BigDecimal latitude;

    public Location(int id, String description,String code, int waterschap_id, BigDecimal longitude, BigDecimal latitude){
        this.id = id;
        this.code = code;
        this.description = description;
        this.waterschap_id = waterschap_id;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    public Location () {  }

    public int getId() { return id;}

    public String getCode() {
        return code;
    }

    public String getDescriptio() { return description;}

    public int getWaterschap_id() { return waterschap_id; }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setId(int id) {this.id = id;}

    public void setCode(String code) {
        this.code = code;
    }

    public void setDescription(String description) {this.description = description;}

    public void setWaterschap_id(int waterschap_id) {
        this.waterschap_id = waterschap_id;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }
}
