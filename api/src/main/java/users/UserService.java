package users;

import api.ApiException;
import api.ApiValidationException;
import authenticate.BCrypt;
import com.google.gson.Gson;
import database.ConnectionManager;
import database.RepositoryException;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

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
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));

        repo.persist(user);

        return new Gson().toJson(user);
	}

	public String createSessionToken(User tempUser) throws ApiException {
        try {
            if(repo.findByEmail(tempUser.getEmail()) == null){
                System.out.println("Couldn't find user: " + tempUser.getEmail());
                return null;
            }
            User user = repo.findByEmail(tempUser.getEmail());
            if (checkPassword(tempUser.getPassword(), user)){
                String sessionToken = UUID.randomUUID().toString();
                saveSession(sessionToken, user.getId());
                return sessionToken;
            } else {
                throw new ApiValidationException("Fout wachtwoord");
            }
        } catch(RepositoryException e){
            throw new ApiException("Cannot retrieve user");
        }
    }

    private boolean checkPassword(String password, User user){
        return BCrypt.checkpw(password, user.getPassword());
    }

    public void saveSession(String sessionToken, int id){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.DATE, 1);
        Timestamp expirationDate = new Timestamp(calendar.getTimeInMillis());
        repo.saveSession(id, sessionToken, expirationDate);
    }

    public boolean logout(String token){
        System.out.println("removing token");
        User user = repo.findBySession(token);
        repo.deleteSession(user.getId());
        return true;
    }
}
