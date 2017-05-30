package authentication;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

import java.util.UUID;

/**
 * Service voor sample-gerelateerde business logic
 * Staat tussen de router en de repository
 *
 * @author Marijn
 * @version 0.1, 30-5-2017
 */
public class AuthService {
	private static final AuthService instance = new AuthService();
	private final AuthRepository repo;

	private AuthService() {
		repo = new AuthRepository(ConnectionManager.getInstance().getConnection());
	}
	
	public static AuthService getInstance() {
		return instance;
	}
	
	public String createSessionToken(User tempUser) throws ApiException {
		try {
            System.out.println("Trying to find user");
            User user = repo.findByUsername(tempUser.getUsername());
            if (user.getPassword().equals(tempUser.getPassword())){
                System.out.println("Creating and sending session ID");
                return UUID.randomUUID().toString();
            } else {
                System.out.println("Passwords don't match");
                return null;
            }
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve sample");
		}
	}
	
}
