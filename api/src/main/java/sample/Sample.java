package sample;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * Sample model
 *
 * @author Wander Groeneveld
 * @version 0.1, 19-5-2017
 */
public class Sample{
	private int id;
	private Timestamp datetime;
	private int locationId;
	private int ownerId;
	private Double quality;
	private BigDecimal latitude;
	private BigDecimal longitude;
	
	public Sample(int id, Timestamp datetime, int locationId, int ownerId, Double quality, BigDecimal latitude, BigDecimal longitude) {
		this.id = id;
		this.datetime = datetime;
		this.locationId = locationId;
		this.ownerId = ownerId;
		this.quality = quality;
		this.latitude = latitude;
		this.longitude = longitude;
	}
	
	public Sample(Timestamp datetime, int locationId, int ownerId, Double quality, BigDecimal latitude, BigDecimal longitude) {
		this(0,datetime,locationId,ownerId,quality,latitude,longitude);
	}
	
	public Sample(){
		this(0,null,0,0,null,null,null);
	}
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public Timestamp getDatetime() {
		return datetime;
	}
	
	public void setDatetime(Timestamp datetime) {
		this.datetime = datetime;
	}
	
	public int getLocationId() {
		return locationId;
	}
	
	public void setLocationId(int locationId) {
		this.locationId = locationId;
	}
	
	public int getOwnerId() {
		return ownerId;
	}
	
	public void setOwnerId(int ownerId) {
		this.ownerId = ownerId;
	}
	
	public Double getQuality() {
		return quality;
	}
	
	public void setQuality(Double quality) {
		this.quality = quality;
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
