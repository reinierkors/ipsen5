package wew.factor;

import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Repository for WEW factors
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class WEWFactorRepository extends RepositoryMaria<WEWFactor>{
	public WEWFactorRepository(Connection connection) {
		super(connection);
	}
	
	@Override
	protected String getTable() {
		return "wew_factor";
	}
	
	@Override
	protected boolean isNew(WEWFactor entity) {
		return entity.getId()==0;
	}
	
	@Override
	protected String[] getColumns() {
		return new String[]{"id","name"};
	}
	
	@Override
	protected void fillParameters(PreparedStatement preparedStatement, WEWFactor entity, boolean appendId) throws RepositoryException {
		try {
			preparedStatement.setString(1,entity.getName());
			if(appendId) {
				preparedStatement.setInt(2, entity.getId());
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected WEWFactor resultSetToModel(ResultSet resultSet) throws RepositoryException {
		try {
			WEWFactor wewFactor = new WEWFactor();
			wewFactor.setId(resultSet.getInt("id"));
			wewFactor.setName(resultSet.getString("name"));
			return wewFactor;
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected void handleGeneratedKeys(WEWFactor entity, ResultSet generatedKeys) throws RepositoryException {
		try {
			generatedKeys.next();
			entity.setId(generatedKeys.getInt("id"));
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
}
