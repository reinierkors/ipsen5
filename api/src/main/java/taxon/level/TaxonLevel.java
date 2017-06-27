package taxon.level;

/**
 * Taxon level model
 *
 * @author Wander Groeneveld
 * @version 0.1, 13-6-2017
 */
public class TaxonLevel {
	private int id;
	private String name;
	
	public TaxonLevel(int id, String name) {
		this.id = id;
		this.name = name;
	}
	
	public TaxonLevel(String name) {
		this(0, name);
	}
	
	public TaxonLevel() {
		this(0, null);
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
