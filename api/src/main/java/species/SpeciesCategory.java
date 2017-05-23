package species;

/**
 * Species category model
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class SpeciesCategory {
	private int id;
	private String name;
	
	public SpeciesCategory(int id, String name) {
		this.id = id;
		this.name = name;
	}
	
	public SpeciesCategory(String name) {
		this(0,name);
	}
	
	public SpeciesCategory() {
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
