package sample;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.*;

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
	protected Sample createModel() {
		return new Sample();
	}
	
	@Override
	protected ColumnData[] getColumns() {
		return new ColumnData[]{
				new ColumnData<>("id", Types.INTEGER, Sample::getId, Sample::setId, true),
				new ColumnData<>("date", Types.DATE, Sample::getDate, Sample::setDate),
				new ColumnData<>("location_id", Types.INTEGER, Sample::getLocationId, Sample::setLocationId),
				new ColumnData<>("owner_id", Types.INTEGER, Sample::getOwnerId, Sample::setOwnerId),
				new ColumnData<>("quality", Types.DOUBLE, Sample::getQuality, Sample::setQuality),
				new ColumnData<>("x_coor", Types.INTEGER, Sample::getXCoor, Sample::setXCoor),
				new ColumnData<>("y_coor", Types.INTEGER, Sample::getYCoor, Sample::setYCoor),
				new ColumnData<>("value", Types.INTEGER, Sample::getValue, Sample::setValue)
		};
	}
}
