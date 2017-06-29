package wew.factorClass;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.Types;

/**
 * Repository for WEW factor classes
 *
 * @author Wander Groeneveld
 * @version 0.3, 9-6-2017
 */
public class WEWFactorClassRepository extends RepositoryMaria<WEWFactorClass>{
	public WEWFactorClassRepository(Connection connection){
		super(connection);
	}
	
	@Override
	protected String getTable(){
		return "wew_factor_class";
	}
	
	@Override
	protected boolean isNew(WEWFactorClass entity){
		return entity.getId() == 0;
	}
	
	@Override
	protected WEWFactorClass createModel(){
		return new WEWFactorClass();
	}
	
	@Override
	protected ColumnData[] getColumns(){
		return new ColumnData[]{new ColumnData<>("id", Types.INTEGER, WEWFactorClass::getId, WEWFactorClass::setId, true), new ColumnData<>("factor_id", Types.INTEGER, WEWFactorClass::getFactorId, WEWFactorClass::setFactorId), new ColumnData<>("code", Types.VARCHAR, WEWFactorClass::getCode, WEWFactorClass::setCode), new ColumnData<>("description", Types.VARCHAR, WEWFactorClass::getDescription, WEWFactorClass::setDescription), new ColumnData<>("order", Types.INTEGER, WEWFactorClass::getOrder, WEWFactorClass::setOrder),};
	}
	
	@Override
	protected String orderBy(){
		return "`order` ASC";
	}
}
