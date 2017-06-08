package users;

import database.ColumnData;
import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.*;

/**
 * Repository for users
 *
 * @author Reinier
 * @version 0.1, 30-5-2017
 */
public class UserRepository extends RepositoryMaria<User>{
    private final PreparedStatement psFindByEmail;
    private final PreparedStatement psFindBySession;
    private final PreparedStatement psSaveSession;
    private final PreparedStatement psDeleteSession;
    private final PreparedStatement psEditPassword;
	public UserRepository(Connection connection) {
		super(connection);
        String findByEmailQuery = "SELECT * FROM `"+getTable()+"` WHERE `email` LIKE ?";
        String findBySessionQuery = "SELECT * FROM `"+getTable()+"` WHERE `session_token` = ?";
        String saveSessionQuery = "UPDATE user SET session_token = ?, expiration_date = ? WHERE `id` = ?";
        String deleteSessionQuery = "UPDATE user SET session_token = NULL, expiration_date = NULL WHERE `id` = ?";
        String editPasswordQuery = "UPDATE user SET `password` = ? WHERE `session_token` = ?";
        try {
            psFindByEmail = connection.prepareStatement(findByEmailQuery);
            psFindBySession = connection.prepareStatement(findBySessionQuery);
            psSaveSession = connection.prepareStatement(saveSessionQuery);
            psDeleteSession = connection.prepareStatement(deleteSessionQuery);
            psEditPassword = connection.prepareStatement(editPasswordQuery);
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
	}

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
                new ColumnData<>("session_token", Types.CHAR, User::getSessionToken, User::setSessionToken),
                new ColumnData<>("expiration_date", Types.TIMESTAMP, User::getExpirationDate, User::setExpirationDate)
		};
	}

    public User findByEmail(String email){
        try {
            psFindByEmail.setString(1, email);
            ResultSet resultSet = psFindByEmail.executeQuery();
            if(resultSet.next()){
                return resultSetToModel(resultSet);
            }
            else
                return null;
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }

    public User findBySession(String sessionToken){
        try {
            psFindBySession.setString(1, sessionToken);
            ResultSet resultSet = psFindBySession.executeQuery();
            if(resultSet.next())
                return resultSetToModel(resultSet);
            else
                return null;
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }

    public void saveSession(int id, String sessionToken, Timestamp expirationDate){
        try{
            psSaveSession.setString(1, sessionToken);
            psSaveSession.setTimestamp(2, expirationDate);
            psSaveSession.setInt(3, id);
            psSaveSession.executeUpdate();
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }

    public void deleteSession(int id){
        try{
            psDeleteSession.setInt(1, id);
            psDeleteSession.executeUpdate();
        }catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }

    public void editPassword(String newPassword, String sessionToken){
        try{
            psEditPassword.setString(1, newPassword);
            psEditPassword.setString(2, sessionToken);
            psEditPassword.executeUpdate();
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }
}
