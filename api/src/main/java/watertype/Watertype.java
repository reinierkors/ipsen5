package watertype;

/**
 * Watertype model
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.2, 31-5-2017
 */
public class Watertype {
	private int id;
	private String name;
	private String code;
	private Integer parentId;
	
	public Watertype(int id, String name, String code, Integer parentId) {
		this.id = id;
		this.name = name;
		this.code = code;
		this.parentId = parentId;
	}
	
	public Watertype(String name, String code, Integer parentId) {
		this(0, name, code, parentId);
	}
	
	public Watertype() {
		this(0, null, null, null);
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
	
	public String getCode() {
		return code;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public Integer getParentId() {
		return parentId;
	}
	
	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}
}
