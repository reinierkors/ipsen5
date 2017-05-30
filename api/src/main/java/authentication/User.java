package authentication;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * Auth model
 *
 * @author Marijn
 * @version 0.1, 30-5-2017
 */
public class User {
    private int id;
	private String username;
    private String password;

	public User(int id, String username, String password) {
	    this.id = id;
		this.username = username;
		this.password = password;
	}

	public User(String username, String password) {
	    id = 0;
        this.username = username;
        this.password = password;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
}
