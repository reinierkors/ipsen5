package users;

import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Repository for users
 *
 * @author Reinier
 * @version 0.1, 30-5-2017
 */
public class UserRepository extends RepositoryMaria<User>{
	public UserRepository(Connection connection) {
		super(connection);
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
		return new String[]{"id","email","password","name","group_id"};
	}

	@Override
	protected void fillParameters(PreparedStatement preparedStatement, User user, boolean appendId) throws RepositoryException {
		try {
			preparedStatement.setInt(1,user.getId());
			preparedStatement.setString(2,user.getEmail());
			preparedStatement.setString(3,user.getPassword());
			preparedStatement.setString(4,user.getName());
			preparedStatement.setInt(5,user.getGroup_id());
			if(appendId) {
				preparedStatement.setInt(6, user.getId());
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}

	@Override
	protected User resultSetToModel(ResultSet resultSet) throws RepositoryException {
		try {
			User user = new User();
			user.setId(resultSet.getInt("id"));
			user.setEmail(resultSet.getString("email"));
			user.setPassword(resultSet.getString("password"));
			user.setName(resultSet.getString("name"));
			user.setGroup_id(resultSet.getInt("group_id"));

			return user;
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
