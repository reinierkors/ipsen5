package users;


import javax.validation.constraints.NotNull;
import java.sql.Date;

/**
 * User model
 *
 * @author Reinier Kors
 * @version 0.1, 30-5-2017
 */
public class User {
	private int id;
	@NotNull(message = "Email is mandatory")
	private String email;
	@NotNull(message = "Password is mandatory")
	private String password;
	@NotNull(message = "Name is mandatory")
	private String name;
	@NotNull(message = "Group_id is mandatory")
	private int group_id;

	public User(int id, String email, String password, String name, int group_id) {
		this.id = id;
		this.email = email;
		this.password = password;
		this.name = name;
		this.group_id = group_id;
	}

	public User(String email, String password, String name, int group_id) {
		this(0, email, password, name, group_id);
	}
	
	public User(){
		this(0, null, null, null, 1);
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getGroup_id() {
		return group_id;
	}

	public void setGroup_id(int group_id) {
		this.group_id = group_id;
	}
}
