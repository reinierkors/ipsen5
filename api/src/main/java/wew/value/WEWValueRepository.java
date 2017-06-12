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
				new ColumnData<>("species_id", Types.INTEGER, WEWValue::getSpeciesId, WEWValue::setSpeciesId),
				new ColumnData<>("value", Types.DOUBLE, WEWValue::getValue, WEWValue::setValue)
		};
	}
	
	/**
	 * Retrieve all WEW values for a given species
	 * @param speciesIds list of ids of species
	 * @return a list of values for all the species with the given ids
	 * @throws RepositoryException when there was a problem retrieving the wew values
	 */
	public List<WEWValue> getBySpecies(List<Integer> speciesIds) throws RepositoryException{
		try{
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			String howManyQuestionMarks = speciesIds.stream().map(id -> "?").collect(commaJoiner);
			
			String queryFindBySpecies = "SELECT * FROM "+getTable()+" WHERE `species_id` IN("+howManyQuestionMarks+")";
			PreparedStatement psFindBySpecies = connection.prepareStatement(queryFindBySpecies);
			ResultSet resultSet = psFindBySpecies.executeQuery();
			
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
