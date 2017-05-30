package waterschap;

import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Repository for waterschap
 *
 * @author Wander Groeneveld
 * @version 0.1, 30-5-2017
 */
public class WaterschapRepository extends RepositoryMaria<Waterschap>{
	public WaterschapRepository(Connection connection) {
		super(connection);
	}
	
	@Override
	protected String getTable() {
		return "waterschap";
	}
	
	@Override
	protected boolean isNew(Waterschap entity) {
		return entity.getId()==0;
	}
	
	@Override
	protected String[] getColumns() {
		return new String[]{"id","name"};
	}
	
	@Override
	protected void fillParameters(PreparedStatement preparedStatement, Waterschap entity, boolean appendId) throws RepositoryException {
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
	protected Waterschap resultSetToModel(ResultSet resultSet) throws RepositoryException {
		try {
			Waterschap waterschap = new Waterschap();
			waterschap.setId(resultSet.getInt("id"));
			waterschap.setName(resultSet.getString("name"));
			return waterschap;
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected void handleGeneratedKeys(Waterschap entity, ResultSet generatedKeys) throws RepositoryException {
		try {
			generatedKeys.next();
			entity.setId(generatedKeys.getInt("id"));
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
}
