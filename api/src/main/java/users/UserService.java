package users;

import api.ApiException;
import com.google.gson.Gson;
import database.ConnectionManager;
import database.RepositoryException;
import waterschap.Waterschap;

/**
 * Service voor user-gerelateerde business logic
 * Staat tussen de router en de repository
 *
 * @author Reinier Kors
 * @version 0.1, 30-5-2017
 */
public class UserService {
	private static final UserService instance = new UserService();
	private final UserRepository repo;
	
	private UserService() {
		repo = new UserRepository(ConnectionManager.getInstance().getConnection());
	}
	
	public static UserService getInstance() {
		return instance;
	}
	
	public User get(int id) throws ApiException {
		try {
			User user = repo.get(id);
			if(user ==null) {
				throw new ApiException("User does not exist");
			}
			return user;
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve user");
		}
	}

	public Iterable<User> getAll() throws ApiException {
		try {
			return repo.getAll();
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve users");
		}
	}

	public User create(String email, String password, String name, String group_id) {
		User user = new User(email, password, name, Integer.parseInt(group_id));

		return user;
	}
}
