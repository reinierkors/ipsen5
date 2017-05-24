package locations;

import java.math.BigDecimal;

/**
 * Location model
 *
 * @author Johan Kruishoop
 * @version 0.1, 24-5-2017
 */

public class Location {
    private String code;
    private String waterschap;
    private BigDecimal longitude;
    private BigDecimal latitude;

    public Location() {

    }

    public String getCode() {
        return code;
    }

    public String getWaterschap() {
        return waterschap;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setWaterschap(String waterschap) {
        this.waterschap = waterschap;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }
}
