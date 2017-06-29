package wew.factorClass;

/**
 * A class (such as "zu") of a factor (such as "Zuurgraad") of the WEW-list
 *
 * @author Wander Groeneveld
 * @version 0.2, 9-6-2017
 */
public class WEWFactorClass{
	private int id;
	private int factorId;
	private String code;
	private String description;
	private int order;
	
	public WEWFactorClass(int id, int factorId, String code, String description, int order){
		this.id = id;
		this.factorId = factorId;
		this.code = code;
		this.description = description;
		this.order = order;
	}
	
	public WEWFactorClass(int factorId, String code, String description, int order){
		this(0, factorId, code, description, order);
	}
	
	public WEWFactorClass(){
		this(0, 0, null, null, 0);
	}
	
	public int getId(){
		return id;
	}
	
	public void setId(int id){
		this.id = id;
	}
	
	public int getFactorId(){
		return factorId;
	}
	
	public void setFactorId(int factorId){
		this.factorId = factorId;
	}
	
	public String getCode(){
		return code;
	}
	
	public void setCode(String code){
		this.code = code;
	}
	
	public String getDescription(){
		return description;
	}
	
	public void setDescription(String description){
		this.description = description;
	}
	
	public int getOrder(){
		return order;
	}
	
	public void setOrder(int order){
		this.order = order;
	}
}
