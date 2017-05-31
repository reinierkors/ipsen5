package wew.factor;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.*;

/**
 * Repository for WEW factors
 *
 * @author Wander Groeneveld
 * @version 0.2, 31-5-2017
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
	protected WEWFactor createModel() {
		return new WEWFactor();
	}
	
	@Override
	protected ColumnData[] getColumns() {
		return new ColumnData[]{
				new ColumnData<>("id", Types.INTEGER, WEWFactor::getId, WEWFactor::setId, true),
				new ColumnData<>("name", Types.VARCHAR, WEWFactor::getName, WEWFactor::setName)
		};
	}
}
