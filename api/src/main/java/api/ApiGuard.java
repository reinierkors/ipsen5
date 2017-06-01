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

    public boolean authCheck(String token){
        System.out.println("Checking header token");
        if (repo.findBySession(token) != null) {
            User currentUser = repo.findBySession(token);
            if (currentUser.getExpirationDate().getTime() > new Timestamp(
                System.currentTimeMillis()).getTime()) {
                System.out.println(currentUser.getExpirationDate().getTime() + " < " + new Timestamp(System.currentTimeMillis()).getTime());
                return true;
            }
            repo.deleteSession(currentUser.getId());
        }
        return false;
    }
}
