package sample;

import java.sql.Date;

/**
 * User model
 *
 * @author Wander Groeneveld
 * @version 0.2, 30-5-2017
 */
public class Sample{
	private int id;
	private Date date;
	private int locationId;
	private int ownerId;
	private Double quality;
	private Integer xCoor;
	private Integer yCoor;
	private Integer value;
	
	public Sample(int id, Date date, int locationId, int ownerId, Double quality, Integer xCoor, Integer yCoor, Integer value) {
		this.id = id;
		this.date = date;
		this.locationId = locationId;
		this.ownerId = ownerId;
		this.quality = quality;
		this.xCoor = xCoor;
		this.yCoor = yCoor;
		this.value = value;
	}
	
	public Sample(Date date, int locationId, int ownerId, Double quality, Integer xCoor, Integer yCoor, Integer value) {
		this(0, date, locationId, ownerId, quality, xCoor, yCoor, value);
	}
	
	public Sample(){
		this(0, null, 0, 0, null, null, null, null);
	}
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public Date getDate() {
		return date;
	}
	
	public void setDate(Date date) {
		this.date = date;
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
	
	public Integer getXCoor() {
		return xCoor;
	}
	
	public void setXCoor(Integer xCoor) {
		this.xCoor = xCoor;
	}
	
	public Integer getYCoor() {
		return yCoor;
	}
	
	public void setYCoor(Integer yCoor) {
		this.yCoor = yCoor;
	}
	
	public Integer getValue() {
		return value;
	}
	
	public void setValue(Integer value) {
		this.value = value;
	}
}
