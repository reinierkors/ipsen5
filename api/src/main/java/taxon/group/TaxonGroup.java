package taxon.group;

/**
 * Taxon group model
 *
 * @author Wander Groeneveld
 * @version 0.2, 17-6-2017
 */
public class TaxonGroup{
	private int id;
	private String code;
	private String description;
	private String icon;
	
	public TaxonGroup(int id, String code, String description, String icon){
		this.id = id;
		this.code = code;
		this.description = description;
		this.icon = icon;
	}
	
	public TaxonGroup(String code, String description, String icon){
		this(0, code, description, icon);
	}
	
	public TaxonGroup(){
		this(0, null, null, null);
	}
	
	public int getId(){
		return id;
	}
	
	public void setId(int id){
		this.id = id;
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
	
	public String getIcon(){
		return icon;
	}
	
	public void setIcon(String icon){
		this.icon = icon;
	}
}
