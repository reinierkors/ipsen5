package users;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.*;

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
				new ColumnData<>("group_id", Types.INTEGER, User::getGroup_id, User::setGroup_id)
		};
	}
}
