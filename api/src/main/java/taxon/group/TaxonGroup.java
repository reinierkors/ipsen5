package taxon.group;

/**
 * Taxon group model
 *
 * @author Wander Groeneveld
 * @version 0.1, 13-6-2017
 */
public class TaxonGroup {
	private int id;
	private String code;
	private String description;
	
	public TaxonGroup(int id, String code, String description) {
		this.id = id;
		this.code = code;
		this.description = description;
	}
	
	public TaxonGroup(String code, String description) {
		this(0, code,description);
	}
	
	public TaxonGroup() {
		this(0, null, null);
	}
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getCode() {
		return code;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
}
