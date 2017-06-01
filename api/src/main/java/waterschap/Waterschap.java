package waterschap;

/**
 * Waterschap model
 *
 * @author Wander Groeneveld
 * @version 0.1, 30-5-2017
 */
public class Waterschap {
	private int id;
	private String name;
	
	public Waterschap(int id, String name) {
		this.id = id;
		this.name = name;
	}
	
	public Waterschap(String name) {
		this(0,name);
	}
	
	public Waterschap() {
		this(0,null);
	}
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
}
