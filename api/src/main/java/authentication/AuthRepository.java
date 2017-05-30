package authentication;

import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Repository for samples
 *
 * @author Marijn
 * @version 0.1, 29-5-2017
 */
public class AuthRepository extends RepositoryMaria<User>{
    private final PreparedStatement psFindByUserName;
	public AuthRepository(Connection connection) {
		super(connection);
        String findByUsernameQuery = "SELECT * FROM `"+getTable()+"` WHERE `username` LIKE ?";

        try {
            psFindByUserName = connection.prepareStatement(findByUsernameQuery);
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
	}

	public User findByUsername(String username){
	    try {
	        psFindByUserName.setString(1, username);
            ResultSet resultSet = psFindByUserName.executeQuery();
            if(resultSet.next())
                return resultSetToModel(resultSet);
            else
                return null;
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
	protected String[] getColumns() {
		return new String[]{"id","username","password"};
	}
	
	@Override
	protected void fillParameters(PreparedStatement preparedStatement, User entity, boolean appendId) throws RepositoryException {
		try {
			preparedStatement.setString(1,entity.getUsername());
			preparedStatement.setString(2,entity.getPassword());
            if(appendId) {
                preparedStatement.setInt(3, entity.getId());
            }
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}

	@Override
	protected User resultSetToModel(ResultSet resultSet) throws RepositoryException {
		try {
			return new User(resultSet.getInt("id"), resultSet.getString("username"), resultSet.getString("password"));
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected void handleGeneratedKeys(User entity, ResultSet generatedKeys) throws RepositoryException {
		try {
			generatedKeys.next();
			entity.setId(generatedKeys.getInt("id"));
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
}
