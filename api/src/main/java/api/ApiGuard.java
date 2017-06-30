package api;

import database.ConnectionManager;
import spark.Request;
import users.User;
import users.UserRepository;

import java.sql.Timestamp;

import static spark.Spark.halt;

/**
 * @author Marijn Kroon
 */
public class ApiGuard{
	private final UserRepository repo;
	
	public ApiGuard(){
		repo = new UserRepository(ConnectionManager.getInstance().getConnection());
	}
	
	/**
	 * Checks is the token exists and is not expired yet
	 *
	 * @param token the session token
	 * @return true if the token exists and is not expired
	 */
	public boolean authCheck(String token){
		if(repo.findBySession(token) != null){
			User currentUser = repo.findBySession(token);
			if(currentUser.getExpirationDate().getTime() > new Timestamp(System.currentTimeMillis()).getTime()){
				return true;
			}
			repo.deleteSession(currentUser.getId());
		}
		return false;
	}
	
	public void adminBeforeCheck(Request request){
		if(request.requestMethod().contains("OPTIONS")){
			return;
		}
		if(Integer.parseInt(request.headers("User-Role")) != 2){
			System.out.println("Request halted - user not an admin");
			halt(401, "Unauthorized");
		}
	}
}
