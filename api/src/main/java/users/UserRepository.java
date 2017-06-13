package users;

import database.ColumnData;
import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.*;

/**
 * Repository for users
 *
 * @author Reinier
 * @version 0.2, 30-5-2017
 */
public class UserRepository extends RepositoryMaria<User>{
    private final String findByEmailQuery, findBySessionQuery, saveSessionQuery, deleteSessionQuery, editPasswordQuery;
    
    public UserRepository(Connection connection) {
		super(connection);
        findByEmailQuery = "SELECT * FROM `"+getTable()+"` WHERE `email` LIKE ?";
        findBySessionQuery = "SELECT * FROM `"+getTable()+"` WHERE `session_token` = ?";
        saveSessionQuery = "UPDATE user SET session_token = ?, expiration_date = ? WHERE `id` = ?";
        deleteSessionQuery = "UPDATE user SET session_token = NULL, expiration_date = NULL WHERE `id` = ?";
        editPasswordQuery = "UPDATE user SET `password` = ? WHERE `session_token` = ?";
	}
	
	private PreparedStatement psFindByEmail() throws SQLException {return connection.prepareStatement(findByEmailQuery);}
	private PreparedStatement psFindBySession() throws SQLException {return connection.prepareStatement(findBySessionQuery);}
	private PreparedStatement psSaveSession() throws SQLException {return connection.prepareStatement(saveSessionQuery);}
	private PreparedStatement psDeleteSession() throws SQLException {return connection.prepareStatement(deleteSessionQuery);}
	private PreparedStatement psEditPassword() throws SQLException {return connection.prepareStatement(editPasswordQuery);}
	
	@Override
	protected String getTable() {
		return "user";
	}

	@Override
	protected boolean isNew(User entity) {
		return entity.getId()==0;
	}

	@Override
	protected User createModel() {
		return new User();
	}

	@Override
	protected ColumnData[] getColumns() {
		return new ColumnData[]{
				new ColumnData<>("id", Types.INTEGER, User::getId, User::setId, true),
				new ColumnData<>("email", Types.VARCHAR, User::getEmail, User::setEmail),
				new ColumnData<>("password", Types.VARCHAR, User::getPassword, User::setPassword),
				new ColumnData<>("name", Types.VARCHAR, User::getName, User::setName),
                new ColumnData<>("group_id", Types.INTEGER, User::getGroup_id, User::setGroup_id),
				new ColumnData<>("waterschap_id", Types.INTEGER, User::getWaterschap_id, User::setWaterschap_id),
				new ColumnData<>("session_token", Types.CHAR, User::getSessionToken, User::setSessionToken),
                new ColumnData<>("expiration_date", Types.TIMESTAMP, User::getExpirationDate, User::setExpirationDate)
		};
	}
	
	/**
	 * Finds a user by its email address
	 * @param email the email address to look for
	 * @return a user object or null if none was found
	 */
    public User findByEmail(String email){
        try {
        	PreparedStatement psFindByEmail = psFindByEmail();
            psFindByEmail.setString(1, email);
            ResultSet resultSet = psFindByEmail.executeQuery();
            
            if(resultSet!=null && resultSet.next())
                return resultSetToModel(resultSet);
            return null;
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }
	
	/**
	 * Finds a user by its session token
	 * @param sessionToken the session token to look for
	 * @return a user object or null if not found
	 */
	public User findBySession(String sessionToken){
        try {
        	PreparedStatement psFindBySession = psFindBySession();
            psFindBySession.setString(1, sessionToken);
            ResultSet resultSet = psFindBySession.executeQuery();
            
            if(resultSet!=null && resultSet.next())
                return resultSetToModel(resultSet);
            return null;
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }
	
	/**
	 * Saves a session to the database
	 * @param id the user id
	 * @param sessionToken a session token to store
	 * @param expirationDate date and time when the session expires
	 */
	public void saveSession(int id, String sessionToken, Timestamp expirationDate){
        try{
        	PreparedStatement psSaveSession = psSaveSession();
            psSaveSession.setString(1, sessionToken);
            psSaveSession.setTimestamp(2, expirationDate);
            psSaveSession.setInt(3, id);
            psSaveSession.executeUpdate();
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }
	
	/**
	 * Deletes the session of the user with the given id
	 * @param id user id
	 */
	public void deleteSession(int id){
        try{
        	PreparedStatement psDeleteSession = psDeleteSession();
            psDeleteSession.setInt(1, id);
            psDeleteSession.executeUpdate();
        }catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }
	
	/**
	 * Changes the password of the user with the given session token
	 * @param newPassword a password hash
	 * @param sessionToken a session token
	 */
	public void editPassword(String newPassword, String sessionToken){
        try{
            PreparedStatement psEditPassword = psEditPassword();
        	psEditPassword.setString(1, newPassword);
            psEditPassword.setString(2, sessionToken);
            psEditPassword.executeUpdate();
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }
}
