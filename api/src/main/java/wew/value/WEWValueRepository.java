package wew.value;

import database.ColumnData;
import database.RepositoryMaria;
import wew.value.WEWValue;

import java.sql.*;

/**
 * Repository for WEW values
 *
 * @author Wander Groeneveld
 * @version 0.2, 31-5-2017
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
	protected WEWValue createModel() {
		return new WEWValue();
	}
	
	@Override
	protected ColumnData[] getColumns() {
		return new ColumnData[]{
				new ColumnData<>("id", Types.INTEGER, WEWValue::getId, WEWValue::setId, true),
				new ColumnData<>("factor_class_id", Types.INTEGER, WEWValue::getFactorClassId, WEWValue::setFactorClassId),
				new ColumnData<>("species_id", Types.INTEGER, WEWValue::getSpeciesId, WEWValue::setSpeciesId),
				new ColumnData<>("value", Types.DOUBLE, WEWValue::getValue, WEWValue::setValue)
		};
	}
}
