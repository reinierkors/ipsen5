package wew.value;

import database.RepositoryException;
import database.RepositoryMaria;
import wew.value.WEWValue;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Repository for WEW values
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class WEWValueRepository extends RepositoryMaria<WEWValue>{
	public WEWValueRepository(Connection connection) {
		super(connection);
	}
	
	@Override
	protected String getTable() {
		return "wew_value";
	}
	
	@Override
	protected boolean isNew(WEWValue entity) {
		return entity.getId()==0;
	}
	
	@Override
	protected String[] getColumns() {
		return new String[]{"id","factor_class_id","species_id","value"};
	}
	
	@Override
	protected void fillParameters(PreparedStatement preparedStatement, WEWValue entity, boolean appendId) throws RepositoryException {
		try {
			preparedStatement.setInt(1,entity.getFactorClassId());
			preparedStatement.setInt(2,entity.getSpeciesId());
			preparedStatement.setDouble(3,entity.getValue());
			if(appendId) {
				preparedStatement.setInt(4, entity.getId());
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected WEWValue resultSetToModel(ResultSet resultSet) throws RepositoryException {
		try {
			WEWValue wewValue = new WEWValue();
			wewValue.setId(resultSet.getInt("id"));
			wewValue.setFactorClassId(resultSet.getInt("factor_class_id"));
			wewValue.setSpeciesId(resultSet.getInt("species_id"));
			wewValue.setValue(resultSet.getDouble("value"));
			return wewValue;
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected void handleGeneratedKeys(WEWValue entity, ResultSet generatedKeys) throws RepositoryException {
		try {
			generatedKeys.next();
			entity.setId(generatedKeys.getInt("id"));
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
}
