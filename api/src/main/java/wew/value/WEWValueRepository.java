package wew.value;

import database.ColumnData;
import database.RepositoryException;
import database.RepositoryMaria;
import wew.value.WEWValue;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * Repository for WEW values
 *
 * @author Wander Groeneveld
 * @version 0.3, 5-6-2017
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
				new ColumnData<>("taxon_id", Types.INTEGER, WEWValue::getTaxonId, WEWValue::setTaxonId),
				new ColumnData<>("value", Types.DOUBLE, WEWValue::getValue, WEWValue::setValue)
		};
	}
	
	/**
	 * Retrieve all WEW values for a given taxon
	 * @param taxonIds list of ids of taxon
	 * @return a list of values for all the taxon with the given ids
	 * @throws RepositoryException when there was a problem retrieving the wew values
	 */
	public List<WEWValue> getByTaxon(List<Integer> taxonIds) throws RepositoryException{
		try{
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			String howManyQuestionMarks = taxonIds.stream().map(id -> "?").collect(commaJoiner);
			
			String queryFindByTaxon = "SELECT * FROM "+getTable()+" WHERE `taxon_id` IN("+howManyQuestionMarks+")";
			PreparedStatement psFindByTaxon = connection.prepareStatement(queryFindByTaxon);
			ResultSet resultSet = psFindByTaxon.executeQuery();
			
			List<WEWValue> values = new ArrayList<>();
			if(resultSet==null)
				return values;
			
			while(resultSet.next()){
				values.add(resultSetToModel(resultSet));
			}
			return values;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
}
