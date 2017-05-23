package sample;

import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Repository for samples
 *
 * @author Wander Groeneveld
 * @version 0.1, 20-5-2017
 */
public class SampleRepository extends RepositoryMaria<Sample>{
	public SampleRepository(Connection connection) {
		super(connection);
	}
	
	@Override
	protected String getTable() {
		return "sample";
	}
	
	@Override
	protected boolean isNew(Sample entity) {
		return entity.getId()==0;
	}
	
	@Override
	protected String[] getColumns() {
		return new String[]{"id","datetime","location_id","owner_id","quality","latitude","longitude"};
	}
	
	@Override
	protected void fillParameters(PreparedStatement preparedStatement, Sample entity, boolean appendId) throws RepositoryException {
		try {
			preparedStatement.setTimestamp(1,entity.getDatetime());
			preparedStatement.setInt(2,entity.getLocationId());
			preparedStatement.setInt(3,entity.getOwnerId());
			preparedStatement.setDouble(4,entity.getQuality());
			preparedStatement.setBigDecimal(5,entity.getLatitude());
			preparedStatement.setBigDecimal(6,entity.getLongitude());
			if(appendId) {
				preparedStatement.setInt(7, entity.getId());
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected Sample resultSetToModel(ResultSet resultSet) throws RepositoryException {
		try {
			Sample sample = new Sample();
			sample.setId(resultSet.getInt("id"));
			sample.setDatetime(resultSet.getTimestamp("datetime"));
			sample.setLocationId(resultSet.getInt("location_id"));
			sample.setOwnerId(resultSet.getInt("owner_id"));
			sample.setQuality(resultSet.getDouble("quality"));
			sample.setLatitude(resultSet.getBigDecimal("latitude"));
			sample.setLongitude(resultSet.getBigDecimal("longitude"));
			return sample;
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected void handleGeneratedKeys(Sample entity, ResultSet generatedKeys) throws RepositoryException {
		try {
			generatedKeys.next();
			entity.setId(generatedKeys.getInt("id"));
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
}
