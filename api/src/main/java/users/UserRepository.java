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
    private final PreparedStatement psSaveSession;
	public UserRepository(Connection connection) {
		super(connection);
        String findByEmailQuery = "SELECT * FROM `"+getTable()+"` WHERE `email` LIKE ?";
        String saveSessionQuery = "UPDATE user SET session_token = ?, expiration_date = ? WHERE `id` = ?";
        try {
            psFindByEmail = connection.prepareStatement(findByEmailQuery);
            psSaveSession = connection.prepareStatement(saveSessionQuery);
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
}
