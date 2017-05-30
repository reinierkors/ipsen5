package species;

/**
 * Species category model
 *
 * @author Wander Groeneveld
 * @version 0.2, 30-5-2017
 */
public class SpeciesCategory {
	private int id;
	private String name;
	private Integer parent;
	
	public SpeciesCategory(int id, String name, Integer parent) {
		this.id = id;
		this.name = name;
		this.parent = parent;
	}
	
	public SpeciesCategory(String name, Integer parent) {
		this(0,name,parent);
	}
	
	public SpeciesCategory(){
		this(0,null,null);
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
	
	public Integer getParent() {
		return parent;
	}
	
	public void setParent(Integer parent) {
		this.parent = parent;
	}
}
