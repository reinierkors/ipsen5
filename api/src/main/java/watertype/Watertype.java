package watertype;

/**
 * Watertype model
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.3, 4-6-2017
 */
public class Watertype {
	private int id;
	private String name;
	private String code;
	
	public Watertype(int id, String name, String code) {
		this.id = id;
		this.name = name;
		this.code = code;
	}
	
	public Watertype(String name, String code, Integer parentId) {
		this(0, name, code);
	}
	
	public Watertype() {
		this(0, null, null);
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
}
