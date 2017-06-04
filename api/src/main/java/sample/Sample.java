package sample;

import java.sql.Date;
import java.util.List;

/**
 * Sample model
 *
 * @author Wander Groeneveld
 * @version 0.3, 3-6-2017
 */
public class Sample{
	private int id;
	private Date date;
	private int locationId;
	private Integer ownerId;
	private Double quality;
	private Integer xCoor;
	private Integer yCoor;
	private List<Integer> speciesIds;
	
	public Sample(int id, Date date, int locationId, Integer ownerId, Double quality, Integer xCoor, Integer yCoor, List<Integer> speciesIds) {
		this.id = id;
		this.date = date;
		this.locationId = locationId;
		this.ownerId = ownerId;
		this.quality = quality;
		this.xCoor = xCoor;
		this.yCoor = yCoor;
		this.speciesIds = speciesIds;
	}
	
	public Sample(Date date, int locationId, Integer ownerId, Double quality, Integer xCoor, Integer yCoor, List<Integer> speciesIds) {
		this(0, date, locationId, ownerId, quality, xCoor, yCoor, speciesIds);
	}
	
	public Sample(){
		this(0, null, 0, null, null, null, null, null);
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
	
	public Integer getOwnerId() {
		return ownerId;
	}
	
	public void setOwnerId(Integer ownerId) {
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
	
	public List<Integer> getSpeciesIds() {
		return speciesIds;
	}
	
	public void setSpeciesIds(List<Integer> speciesIds) {
		this.speciesIds = speciesIds;
	}
}
