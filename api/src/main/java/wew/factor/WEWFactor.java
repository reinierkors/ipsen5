package wew.factor;

/**
 * A factor (such as "Zuurgraad") in the WEW-list
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class WEWFactor{
	private int id;
	private String name;
	
	public WEWFactor(int id, String name){
		this.id = id;
		this.name = name;
	}
	
	public WEWFactor(String name){
		this(0, name);
	}
	
	public WEWFactor(){
		this(0, null);
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
}
