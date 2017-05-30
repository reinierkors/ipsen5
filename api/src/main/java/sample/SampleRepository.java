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
 * @version 0.2, 30-5-2017
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
		return new String[]{"id","date","location_id","owner_id","quality","x_coor","y_coor","value"};
	}
	
	@Override
	protected void fillParameters(PreparedStatement preparedStatement, Sample entity, boolean appendId) throws RepositoryException {
		try {
			preparedStatement.setDate(1,entity.getDate());
			preparedStatement.setInt(2,entity.getLocationId());
			preparedStatement.setInt(3,entity.getOwnerId());
			preparedStatement.setDouble(4,entity.getQuality());
			preparedStatement.setInt(5,entity.getXCoor());
			preparedStatement.setInt(6,entity.getYCoor());
			preparedStatement.setInt(7,entity.getValue());
			if(appendId) {
				preparedStatement.setInt(8, entity.getId());
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
			sample.setDate(resultSet.getDate("date"));
			sample.setLocationId(resultSet.getInt("location_id"));
			sample.setOwnerId(resultSet.getInt("owner_id"));
			sample.setQuality(resultSet.getDouble("quality"));
			sample.setXCoor(resultSet.getInt("x_coor"));
			sample.setYCoor(resultSet.getInt("y_coor"));
			sample.setValue(resultSet.getInt("value"));
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
