package users;

import api.ApiException;
import api.ApiValidationException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import database.ConnectionManager;
import database.RepositoryException;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.ArrayList;
import java.util.List;

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
	private static Validator validator;
	
	private UserService() {
		repo = new UserRepository(ConnectionManager.getInstance().getConnection());
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
	}
	
	public static UserService getInstance() {
		return instance;
	}
	
	public User get(int id) throws ApiException {
		try {
			User user = repo.get(id);
			if (user == null) {
				throw new ApiValidationException("User does not exist");
			}
			return user;
		} catch(RepositoryException e) {
			throw new ApiValidationException("Cannot retrieve user");
		}
	}

	public Iterable<User> getAll() throws ApiException {
		try {
			return repo.getAll();
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve users");
		}
	}

	public String create(User user) {
	    List<String> errors = new ArrayList<>();
        validator
                .validate(user).stream()
                .forEach(violation -> errors.add(violation.getMessage()));

        if (errors.size() > 0) {
            throw new ApiValidationException(errors);
        }
        return new Gson().toJson(user);
	}
}
