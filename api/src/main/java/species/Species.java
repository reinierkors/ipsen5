package species;

/**
 * Species model
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class Species {
	private int id;
	private String name;
	private Integer categoryId;
	
	public Species(int id, String name, Integer categoryId) {
		this.id = id;
		this.name = name;
		this.categoryId = categoryId;
	}
	
	public Species(String name, Integer categoryId) {
		this(0,name,categoryId);
	}
	
	public Species(String name){
		this(0,name,null);
	}
	
	public Species() {
		this(0,null,0);
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
	
	public Integer getCategoryId() {
		return categoryId;
	}
	
	public void setCategoryId(Integer categoryId) {
		this.categoryId = categoryId;
	}
}
