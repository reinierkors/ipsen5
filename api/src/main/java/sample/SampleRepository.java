package sample;

import database.ColumnData;
import database.RepositoryException;
import database.RepositoryMaria;
import location.Location;

import java.sql.*;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * Repository for samples
 *
 * @author Wander Groeneveld, Dylan de Wit
 * @version 0.5, 27-6-2017
 */
public class SampleRepository extends RepositoryMaria<Sample>{
	private final String queryGetTaxon;
	
	public SampleRepository(Connection connection){
		super(connection);
		queryGetTaxon = "SELECT `taxon_id`,`value` FROM `sample_taxon` WHERE `sample_id` = ?";
	}
	
	@Override
	protected String getTable(){
		return "sample";
	}
	
	@Override
	protected boolean isNew(Sample entity){
		return entity.getId() == 0;
	}
	
	@Override
	protected Sample createModel(){
		return new Sample();
	}
	
	@Override
	protected ColumnData[] getColumns(){
		return new ColumnData[]{new ColumnData<>("id", Types.INTEGER, Sample::getId, Sample::setId, true), new ColumnData<>("date", Types.DATE, Sample::getDate, Sample::setDate), new ColumnData<>("location_id", Types.INTEGER, Sample::getLocationId, Sample::setLocationId), new ColumnData<>("owner_id", Types.INTEGER, Sample::getOwnerId, Sample::setOwnerId), new ColumnData<>("quality", Types.DOUBLE, Sample::getQuality, Sample::setQuality), new ColumnData<>("x_coor", Types.INTEGER, Sample::getXCoor, Sample::setXCoor), new ColumnData<>("y_coor", Types.INTEGER, Sample::getYCoor, Sample::setYCoor), new ColumnData<>("date_added", Types.TIMESTAMP, Sample::getDateAdded, Sample::setDateAdded)};
	}
	
	@Override
	public Sample get(int id) throws RepositoryException{
		try{
			Sample sample = super.get(id);
			if(sample == null)
				return null;
			//Retrieve taxon ids and values, and put them in the sample object
			PreparedStatement psGetTaxon = connection.prepareStatement(queryGetTaxon);
			psGetTaxon.setInt(1, sample.getId());
			ResultSet resultSet = psGetTaxon.executeQuery();
			
			Map<Integer, Integer> taxonValues = new HashMap<>();
			if(resultSet != null){
				while(resultSet.next()){
					taxonValues.put(resultSet.getInt("taxon_id"), resultSet.getInt("value"));
				}
			}
			sample.setTaxonValues(taxonValues);
			return sample;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public List<Sample> get(List<Integer> ids) throws RepositoryException{
		try{
			List<Sample> samples = super.get(ids);
			if(samples.isEmpty())
				return samples;
			
			//Retrieve taxon ids and values, and put them in the sample object
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			String howManyQuestionMarks = samples.stream().map(sample -> "?").collect(commaJoiner);
			
			String queryGetTaxonMulti = "SELECT `sample_id`,`taxon_id`,`value` FROM `sample_taxon` WHERE `sample_id` IN (" + howManyQuestionMarks + ")";
			PreparedStatement psGetTaxonMulti = connection.prepareStatement(queryGetTaxonMulti);
			
			Map<Integer, Map<Integer, Integer>> sampleIdToTaxonValuesMap = new HashMap<>();
			int index = 1;
			for(Sample sample : samples){
				Map<Integer, Integer> map = new HashMap<>();
				sampleIdToTaxonValuesMap.put(sample.getId(), map);
				sample.setTaxonValues(map);
				psGetTaxonMulti.setInt(index, sample.getId());
				++index;
			}
			
			ResultSet resultSet = psGetTaxonMulti.executeQuery();
			if(resultSet != null){
				while(resultSet.next()){
					int sampleId = resultSet.getInt("sample_id");
					int taxonId = resultSet.getInt("taxon_id");
					int value = resultSet.getInt("value");
					sampleIdToTaxonValuesMap.get(sampleId).put(taxonId, value);
				}
			}
			
			return samples;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public List<Sample> getAll() throws RepositoryException{
		throw new RepositoryException("Resource too large to request all");
	}
	
	@Override
	public void persist(Sample sample) throws RepositoryException{
		try{
			super.persist(sample);
			
			//Save sample taxon and values
			
			//For the following 5 maps: key is `sample_taxon`.`taxon_id`, value is `sample_taxon`.`value`
			//Taxon in database before saving
			Map<Integer, Integer> oldTaxonMap;
			//Taxon we want in the database
			Map<Integer, Integer> newTaxonMap = sample.getTaxonValues();
			//Taxon that have been removed
			Map<Integer, Integer> removedTaxonMap;
			//Taxon that have been added
			Map<Integer, Integer> addedTaxonMap;
			//Taxon that have its values changed (map value is the new value)
			Map<Integer, Integer> changedTaxonMap;
			
			//Read old rows from the database
			PreparedStatement psGetTaxon = connection.prepareStatement(queryGetTaxon);
			psGetTaxon.setInt(1, sample.getId());
			ResultSet resultSet = psGetTaxon.executeQuery();
			oldTaxonMap = new HashMap<>();
			if(resultSet != null){
				while(resultSet.next()){
					oldTaxonMap.put(resultSet.getInt("taxon_id"), resultSet.getInt("value"));
				}
			}
			
			//Check which taxon are new
			addedTaxonMap = new HashMap<>(newTaxonMap);
			oldTaxonMap.forEach((taxon, value) -> addedTaxonMap.remove(taxon));
			
			//Check which taxon are removed
			removedTaxonMap = new HashMap<>(oldTaxonMap);
			newTaxonMap.forEach((taxon, value) -> removedTaxonMap.remove(taxon));
			
			//Check which taxon values are changed
			changedTaxonMap = new HashMap<>();
			newTaxonMap.forEach((taxon, value) -> {
				if(!oldTaxonMap.containsKey(taxon))
					return;
				int oldValue = oldTaxonMap.get(taxon);
				if(!value.equals(oldValue)){
					changedTaxonMap.put(taxon, value);
				}
			});
			
			
			//Save added items to the database
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			if(addedTaxonMap.size() > 0){
				Set<Integer> addedTaxonKeys = addedTaxonMap.keySet();
				String valueParams = addedTaxonKeys.stream().map(k -> "(?,?,?)").collect(commaJoiner);
				String queryInsertTaxon = "INSERT INTO `sample_taxon`(`sample_id`,`taxon_id`,`value`) VALUES " + valueParams;
				PreparedStatement psInsertTaxon = connection.prepareStatement(queryInsertTaxon);
				int index = 1;
				for(int addedTaxon : addedTaxonKeys){
					psInsertTaxon.setInt(index, sample.getId());
					++index;
					psInsertTaxon.setInt(index, addedTaxon);
					++index;
					psInsertTaxon.setInt(index, addedTaxonMap.get(addedTaxon));
					++index;
				}
				psInsertTaxon.executeUpdate();
			}
			
			//Delete removed items from the database
			if(removedTaxonMap.size() > 0){
				Set<Integer> removedTaxonKeys = removedTaxonMap.keySet();
				String howManyQuestionMarks = removedTaxonKeys.stream().map(k -> "?").collect(commaJoiner);
				String queryDeleteTaxon = "DELETE FROM `sample_taxon` WHERE `sample_id` = ? AND `taxon_id` IN (" + howManyQuestionMarks + ")";
				PreparedStatement psDeleteTaxon = connection.prepareStatement(queryDeleteTaxon);
				psDeleteTaxon.setInt(1, sample.getId());
				int index = 2;
				for(int removedTaxon : removedTaxonKeys){
					psDeleteTaxon.setInt(index, removedTaxon);
					++index;
				}
				psDeleteTaxon.executeUpdate();
			}
			
			//Save changed values to the database
			//Delete removed items from the database
			Set<Integer> changedTaxonKeys = changedTaxonMap.keySet();
			String queryChangedTaxon = "UPDATE `sample_taxon` SET `value` = ? WHERE `sample_id` = ? AND `taxon_id` = ?";
			PreparedStatement psChangedTaxon = connection.prepareStatement(queryChangedTaxon);
			for(int changedTaxon : changedTaxonKeys){
				psChangedTaxon.setInt(1, changedTaxonMap.get(changedTaxon));
				psChangedTaxon.setInt(2, sample.getId());
				psChangedTaxon.setInt(3, changedTaxon);
				psChangedTaxon.executeUpdate();
			}
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public void persist(List<? extends Sample> samples) throws RepositoryException{
		samples.forEach(this::persist);
	}
	
	@Override
	public void remove(int id) throws RepositoryException{
		try{
			String queryDeleteTaxon = "DELETE FROM `sample_taxon` WHERE `sample_id` = ?";
			PreparedStatement psDeleteTaxon = connection.prepareStatement(queryDeleteTaxon);
			psDeleteTaxon.setInt(1, id);
			psDeleteTaxon.executeUpdate();
			
			super.remove(id);
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public void remove(List<Integer> ids) throws RepositoryException{
		try{
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			String howManyQuestionMarks = ids.stream().map(id -> "?").collect(commaJoiner);
			String queryDeleteTaxon = "DELETE FROM `sample_taxon` WHERE `sample_id` IN (" + howManyQuestionMarks + ")";
			PreparedStatement psDeleteTaxon = connection.prepareStatement(queryDeleteTaxon);
			int index = 1;
			for(int id : ids){
				psDeleteTaxon.setInt(index, id);
				++index;
			}
			psDeleteTaxon.executeUpdate();
			
			super.remove(ids);
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	public List<Sample> getByLocationId(int id){
		try{
			List<Sample> samples = new ArrayList<>();
			//Retrieve species ids and put them in the sample object
			String getSampelsByLocation = "SELECT * FROM sample WHERE location_id = ?";
			PreparedStatement getLocations = connection.prepareStatement(getSampelsByLocation);
			getLocations.setInt(1, id);
			ResultSet resultSet = getLocations.executeQuery();
			
			if(resultSet != null){
				while(resultSet.next()){
					samples.add(resultSetToModel(resultSet));
				}
			}
			return samples;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	public String getHighestDateById(Location location){
		try{
			String getMaxYearStr = "SELECT MAX(year(date)) as date FROM " + getTable() + " WHERE location_id = ?";
			PreparedStatement getMaxYear = connection.prepareStatement(getMaxYearStr);
			getMaxYear.setInt(1, location.getId());
			ResultSet resultSet = getMaxYear.executeQuery();
			resultSet.next();
			return resultSet.getString("date");
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	public List<String> getDistinctYears(){
		try{
			List<String> years = new ArrayList<>();
			String getYearsStr = "SELECT DISTINCT year(date) as year FROM sample ORDER BY year DESC";
			PreparedStatement getYears = connection.prepareStatement(getYearsStr);
			ResultSet resultSet = getYears.executeQuery();
			
			if(resultSet != null){
				while(resultSet.next()){
					years.add(resultSet.getString("year"));
				}
			}
			return years;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	
	public List<Sample> getRecent(int count){
		try{
			String getRecentQuery = "SELECT * FROM `" + getTable() + "` ORDER BY `date_added` DESC LIMIT 0," + count;
			PreparedStatement psGetRecent = connection.prepareStatement(getRecentQuery);
			
			ResultSet resultSet = psGetRecent.executeQuery();
			
			List<Sample> list = new ArrayList<>();
			if(resultSet == null)
				return list;
			
			while(resultSet.next()){
				list.add(resultSetToModel(resultSet));
			}
			
			return list;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
}