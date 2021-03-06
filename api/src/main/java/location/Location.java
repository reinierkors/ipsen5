package location;

/**
 * Location model
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.2, 4-6-2017
 */
public class Location {
    private int id;
    private String code;
    private String description;
    private Integer xCoord;
    private Integer yCoord;
    private Double latitude;
    private Double longitude;
    private Integer waterschapId;
    private Integer watertypeId;
    private Integer watertypeKrwId;
	
	public Location(int id, String code, String description, Integer xCoord, Integer yCoord, Double latitude, Double longitude, Integer waterschapId, Integer watertypeId, Integer watertypeKrwId) {
		this.id = id;
		this.code = code;
		this.description = description;
		this.xCoord = xCoord;
		this.yCoord = yCoord;
		this.latitude = latitude;
		this.longitude = longitude;
		this.waterschapId = waterschapId;
		this.watertypeId = watertypeId;
		this.watertypeKrwId = watertypeKrwId;
	}
	
	public Location(String code, String description, Integer xCoord, Integer yCoord, Double latitude, Double longitude, Integer waterschapId, Integer watertypeId, Integer watertypeKrwId) {
		this(0, code, description, xCoord, yCoord, latitude, longitude, waterschapId, watertypeId, watertypeKrwId);
	}
	
	public Location(){
		this(0, null, null, null, null, null, null, null, null, null);
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
	
	public Integer getxCoord() {
		return xCoord;
	}
	
	public void setxCoord(Integer xCoord) {
		this.xCoord = xCoord;
	}
	
	public Integer getyCoord() {
		return yCoord;
	}
	
	public void setyCoord(Integer yCoord) {
		this.yCoord = yCoord;
	}
	
	public Double getLatitude() {
		return latitude;
	}
	
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	
	public Double getLongitude() {
		return longitude;
	}
	
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	
	public Integer getWaterschapId() {
		return waterschapId;
	}
	
	public void setWaterschapId(Integer waterschapId) {
		this.waterschapId = waterschapId;
	}
	
	public Integer getWatertypeId() {
		return watertypeId;
	}
	
	public void setWatertypeId(Integer watertypeId) {
		this.watertypeId = watertypeId;
	}
	
	public Integer getWatertypeKrwId() {
		return watertypeKrwId;
	}
	
	public void setWatertypeKrwId(Integer watertypeKrwId) {
		this.watertypeKrwId = watertypeKrwId;
	}
}
