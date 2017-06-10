package api;

import database.ConnectionManager;
import users.User;
import users.UserRepository;

import java.sql.Timestamp;

/**
 * @author Marijn Kroon
 */
public class ApiGuard {
    private UserRepository repo;
    public ApiGuard(){
        repo = new UserRepository(ConnectionManager.getInstance().getConnection());
    }
    
    /**
     * Checks is the token exists and is not expired yet
     * @param token the session token
     * @return true if the token exists and is not expired
     */
    public boolean authCheck(String token){
        if (repo.findBySession(token) != null) {
            User currentUser = repo.findBySession(token);
            if (currentUser.getExpirationDate().getTime() > new Timestamp(
                System.currentTimeMillis()).getTime()) {
                return true;
            }
            repo.deleteSession(currentUser.getId());
        }
        return false;
    }
}
