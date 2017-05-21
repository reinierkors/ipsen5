package wew.factorClass;

import database.RepositoryException;
import database.RepositoryMaria;
import wew.factor.WEWFactor;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Repository for WEW factor classes
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class WEWFactorClassRepository extends RepositoryMaria<WEWFactorClass>{
	public WEWFactorClassRepository(Connection connection) {
		super(connection);
	}
	
	@Override
	protected String getTable() {
		return "wew_factor_class";
	}
	
	@Override
	protected boolean isNew(WEWFactorClass entity) {
		return entity.getId()==0;
	}
	
	@Override
	protected String[] getColumns() {
		return new String[]{"id","factor_id","code","description"};
	}
	
	@Override
	protected void fillParameters(PreparedStatement preparedStatement, WEWFactorClass entity, boolean appendId) throws RepositoryException {
		try {
			preparedStatement.setInt(1,entity.getFactorId());
			preparedStatement.setString(2,entity.getCode());
			preparedStatement.setString(3,entity.getDescription());
			if(appendId) {
				preparedStatement.setInt(4, entity.getId());
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected WEWFactorClass resultSetToModel(ResultSet resultSet) throws RepositoryException {
		try {
			WEWFactorClass wewFactorClass = new WEWFactorClass();
			wewFactorClass.setId(resultSet.getInt("id"));
			wewFactorClass.setFactorId(resultSet.getInt("factor_id"));
			wewFactorClass.setCode(resultSet.getString("code"));
			wewFactorClass.setDescription(resultSet.getString("description"));
			return wewFactorClass;
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected void handleGeneratedKeys(WEWFactorClass entity, ResultSet generatedKeys) throws RepositoryException {
		try {
			generatedKeys.next();
			entity.setId(generatedKeys.getInt("id"));
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
}
