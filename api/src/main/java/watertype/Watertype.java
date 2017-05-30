package watertype;

/**
 * Created by Dylan on 30-5-2017.
 */
public class Watertype {
    private int id;
    private int parentId;
    private String name;
    private String code;

    public Watertype(int id, int parentId, String name, String code) {
        this.id = id;
        this.parentId = parentId;
        this.name = name;
        this.code = code;
    }

    public Watertype(String name, String code) {
        this(0, 0, name, code);
    }

    public Watertype() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
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
