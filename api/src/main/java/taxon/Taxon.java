package taxon;

/**
 * Taxon model
 *
 * @author Wander Groeneveld
 * @version 0.2, 13-6-2017
 */
public class Taxon{
	private int id;
	private String name;
	private Integer groupId;
	private Integer levelId;
	private Integer parentId;
	private Integer referId;
	
	public Taxon(int id, String name, Integer groupId, Integer levelId, Integer parentId, Integer referId){
		this.id = id;
		this.name = name == null ? null : name.toLowerCase();
		this.groupId = groupId;
		this.levelId = levelId;
		this.parentId = parentId;
		this.referId = referId;
	}
	
	public Taxon(String name, Integer groupId, Integer levelId, Integer parentId, Integer referId){
		this(0, name, groupId, levelId, parentId, referId);
	}
	
	public Taxon(){
		this(0, null, null, null, null, null);
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
		this.name = name == null ? null : name.toLowerCase();
	}
	
	public Integer getGroupId(){
		return groupId;
	}
	
	public void setGroupId(Integer groupId){
		this.groupId = groupId;
	}
	
	public Integer getLevelId(){
		return levelId;
	}
	
	public void setLevelId(Integer levelId){
		this.levelId = levelId;
	}
	
	public Integer getParentId(){
		return parentId;
	}
	
	public void setParentId(Integer parentId){
		this.parentId = parentId;
	}
	
	public Integer getReferId(){
		return referId;
	}
	
	public void setReferId(Integer referId){
		this.referId = referId;
	}
}
