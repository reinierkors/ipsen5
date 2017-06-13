package users;

import api.ApiException;
import api.ApiValidationException;
import authenticate.BCrypt;
import com.google.gson.Gson;
import database.ConnectionManager;
import database.RepositoryException;
import jdk.nashorn.internal.parser.JSONParser;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

/**
 * Service for user features
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
	
	/**
	 * Retrieve a user by id
	 * @param id user id
	 * @return user object
	 * @throws ApiException when there's a problem retrieving the user, or the user does not exist
	 */
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

	User getCurrentUser(String sessionToken) throws ApiException {
        try {
            User user = repo.findBySession(sessionToken);
            if (user == null) {
                throw new ApiValidationException("User does not exist");
            }
            user.setPassword(null);
            return user;
        } catch(RepositoryException e) {
            throw new ApiValidationException("Cannot retrieve user");
        }
    }

    User editUser(User user) throws ApiException {
	    try {
	        repo.editUser(user);
	        return user;
        } catch(RepositoryException e) {
            throw new ApiValidationException("Cannot retrieve user");
        }
    }
	
	/**
	 * Retrieves all users
	 * @return a list of all users
	 * @throws ApiException when there was a problem retrieving all users
	 */
	public Iterable<User> getAll() throws ApiException {
		try {
			return repo.getAll();
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve users");
		}
	}
	
	/**
	 * Creates a mew user
	 * @param user object
	 * @return a json string of the user
	 */
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
            if (repo.findByEmail(tempUser.getEmail()) == null){
                throw new ApiValidationException("Fout wachtwoord/email");
            }
            User user = repo.findByEmail(tempUser.getEmail());
            if (checkPassword(tempUser.getPassword(), user)){
                String sessionToken = UUID.randomUUID().toString();
                saveSession(sessionToken, user.getId());
                return sessionToken;
            } else {
                throw new ApiValidationException("Fout wachtwoord/email");
            }
        } catch(RepositoryException e){
            throw new ApiException("Cannot retrieve user");
        }
    }
	
    boolean editPassword(String oldPassword, String newPassword, String confirmPassword, String sessionToken){
	    if(repo.findBySession(sessionToken) == null){
            throw new ApiValidationException("Gebruiker niet gevonden");
        }
        User currentUser = repo.findBySession(sessionToken);
	    if(!checkPassword(oldPassword, currentUser)){
            throw new ApiValidationException("Wachtwoord klopt niet");
        }
	    if(!newPassword.equals(confirmPassword)){
            throw new ApiValidationException("Nieuwe wachtwoorden komen niet overeen");
        }
	    repo.editPassword(BCrypt.hashpw(newPassword, BCrypt.gensalt()), sessionToken);
        return true;
    }

    public boolean check(List<String> passwords){

        System.out.println(passwords);
        return true;
    }

    private boolean checkPassword(String password, User user){
        return BCrypt.checkpw(password, user.getPassword());
    }

    private void saveSession(String sessionToken, int id){
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
