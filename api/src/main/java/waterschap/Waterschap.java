package waterschap;

/**
 * Waterschap model
 *
 * @author Wander Groeneveld
 * @version 0.1, 30-5-2017
 */
public class Waterschap{
	private int id;
	private String name;
	private String address;
	private Integer houseNumber;
	private String zipCode;
	private String location;
	private String phoneNumber;
	
	public Waterschap(int id, String name, String address, int houseNumber, String zipCode, String location, String phoneNumber){
		this.id = id;
		this.name = name;
		this.address = address;
		this.houseNumber = houseNumber;
		this.zipCode = zipCode;
		this.location = location;
		this.phoneNumber = phoneNumber;
	}
	
	public Waterschap(String name, String address, int houseNumber, String zipCode, String location, String phoneNumber){
		this(0, name, address, houseNumber, zipCode, location, phoneNumber);
	}
	
	public Waterschap(){
		this(0, null, null, 0, null, null, null);
	}
	
	public int getId(){
		return id;
	}
	
	public void setId(int id){
		this.id = id;
	}
	
	public String getName(){
		return name;
	}
	
	public void setName(String name){
		this.name = name;
	}
	
	public String getAddress(){
		return address;
	}
	
	public void setAddress(String address){
		this.address = address;
	}
	
	public Integer getHouseNumber(){
		return houseNumber;
	}
	
	public void setHouseNumber(Integer houseNumber){
		this.houseNumber = houseNumber;
	}
	
	public String getZipCode(){
		return zipCode;
	}
	
	public void setZipCode(String zipCode){
		this.zipCode = zipCode;
	}
	
	public String getLocation(){
		return location;
	}
	
	public void setLocation(String location){
		this.location = location;
	}
	
	public String getPhoneNumber(){
		return phoneNumber;
	}
	
	public void setPhoneNumber(String phoneNumber){
		this.phoneNumber = phoneNumber;
	}
}
