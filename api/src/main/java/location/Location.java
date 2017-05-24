package location;

import java.math.BigDecimal;

/**
 * Location model
 *
 * @author Dylan de Wit
 * @version 0.1, 24-5-2017
 */
public class Location {
    private int id;
    private String code;
    private String description;
    private int xCoord;
    private int yCoord;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public Location() {

    }

    public Location(int id, String code, String description, int xCoord,
                    int yCoord, BigDecimal latitude, BigDecimal longitude) {
        this.id = id;
        this.code = code;
        this.description = description;
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Location(String code, String description, int xCoord,
                    int yCoord, BigDecimal latitude, BigDecimal longitude) {
        this(0, code, description, xCoord, yCoord, latitude, longitude);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getxCoord() {
        return xCoord;
    }

    public void setxCoord(int xCoord) {
        this.xCoord = xCoord;
    }

    public int getyCoord() {
        return yCoord;
    }

    public void setyCoord(int yCoord) {
        this.yCoord = yCoord;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }
}
