package sample;

import database.ColumnData;
import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.*;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * Repository for samples
 *
 * @author Wander Groeneveld
 * @version 0.4, 8-6-2017
 */
public class SampleRepository extends RepositoryMaria<Sample>{
	private final String queryGetSpecies;
	
	public SampleRepository(Connection connection) {
		super(connection);
		queryGetSpecies = "SELECT `species_id`,`value` FROM `sample_species` WHERE `sample_id` = ?";
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
				new ColumnData<>("y_coor", Types.INTEGER, Sample::getYCoor, Sample::setYCoor)
		};
	}
	
	@Override
	public Sample get(int id) throws RepositoryException {
		try {
			Sample sample = super.get(id);
			//Retrieve species ids and values, and put them in the sample object
			PreparedStatement psGetSpecies = connection.prepareStatement(queryGetSpecies);
			psGetSpecies.setInt(1,sample.getId());
			ResultSet resultSet = psGetSpecies.executeQuery();
			
			Map<Integer,Integer> speciesValues = new HashMap<>();
			if(resultSet!=null){
				while(resultSet.next()){
					speciesValues.put(resultSet.getInt("species_id"),resultSet.getInt("value"));
				}
			}
			sample.setSpeciesValues(speciesValues);
			return sample;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public List<Sample> get(List<Integer> ids) throws RepositoryException {
		try {
			List<Sample> samples = super.get(ids);
			
			//Retrieve species ids and values, and put them in the sample object
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			String howManyQuestionMarks = samples.stream().map(sample -> "?").collect(commaJoiner);
			
			String queryGetSpeciesMulti = "SELECT `sample_id`,`species_id`,`value` FROM `sample_species` WHERE `sample_id` IN ("+howManyQuestionMarks+")";
			PreparedStatement psGetSpeciesMulti = connection.prepareStatement(queryGetSpeciesMulti);
			
			Map<Integer,Map<Integer,Integer>> sampleIdToSpeciesValuesMap = new HashMap<>();
			int index = 1;
			for(Sample sample:samples){
				Map<Integer,Integer> map = new HashMap<>();
				sampleIdToSpeciesValuesMap.put(sample.getId(),map);
				sample.setSpeciesValues(map);
				psGetSpeciesMulti.setInt(index,sample.getId());
				++index;
			}
			
			ResultSet resultSet = psGetSpeciesMulti.executeQuery();
			if(resultSet!=null) {
				while(resultSet.next()){
					int sampleId = resultSet.getInt("sample_id");
					int speciesId = resultSet.getInt("species_id");
					int value = resultSet.getInt("value");
					sampleIdToSpeciesValuesMap.get(sampleId).put(speciesId,value);
				}
			}
			
			return samples;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public List<Sample> getAll() throws RepositoryException {
		throw new RepositoryException("Resource too large to request all");
	}
	
	@Override
	public void persist(Sample sample) throws RepositoryException {
		try {
			super.persist(sample);
			
			//Save sample species and values
			
			//For the following 5 maps: key is `sample_species`.`species_id`, value is `sample_species`.`value`
			//Species in database before saving
			Map<Integer,Integer> oldSpeciesMap;
			//Species we want in the database
			Map<Integer,Integer> newSpeciesMap = sample.getSpeciesValues();
			//Species that have been removed
			Map<Integer,Integer> removedSpeciesMap;
			//Species that have been added
			Map<Integer,Integer> addedSpeciesMap;
			//Species that have its values changed (map value is the new value)
			Map<Integer,Integer> changedSpeciesMap;
			
			//Read old rows from the database
			PreparedStatement psGetSpecies = connection.prepareStatement(queryGetSpecies);
			psGetSpecies.setInt(1,sample.getId());
			ResultSet resultSet = psGetSpecies.executeQuery();
			oldSpeciesMap = new HashMap<>();
			if(resultSet!=null){
				while(resultSet.next()){
					oldSpeciesMap.put(resultSet.getInt("species_id"),resultSet.getInt("value"));
				}
			}
			
			//Check which species are new
			addedSpeciesMap = new HashMap<>(newSpeciesMap);
			oldSpeciesMap.forEach((species,value) -> addedSpeciesMap.remove(species));
			
			//Check which species are removed
			removedSpeciesMap = new HashMap<>(oldSpeciesMap);
			newSpeciesMap.forEach((species,value) -> removedSpeciesMap.remove(species));
			
			//Check which species values are changed
			changedSpeciesMap = new HashMap<>();
			newSpeciesMap.forEach((species,value) -> {
				if(!oldSpeciesMap.containsKey(species))
					return;
				int oldValue = oldSpeciesMap.get(species);
				if(!value.equals(oldValue)){
					changedSpeciesMap.put(species,value);
				}
			});
			
			
			//Save added items to the database
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			if(addedSpeciesMap.size()>0){
				Set<Integer> addedSpeciesKeys = addedSpeciesMap.keySet();
				String valueParams = addedSpeciesKeys.stream().map(k -> "(?,?,?)").collect(commaJoiner);
				String queryInsertSpecies = "INSERT INTO `sample_species`(`sample_id`,`species_id`,`value`) VALUES "+valueParams;
				PreparedStatement psInsertSpecies = connection.prepareStatement(queryInsertSpecies);
				int index = 1;
				for(int addedSpecies : addedSpeciesKeys){
					psInsertSpecies.setInt(index,sample.getId());
					++index;
					psInsertSpecies.setInt(index,addedSpecies);
					++index;
					psInsertSpecies.setInt(index,addedSpeciesMap.get(addedSpecies));
					++index;
				}
				psInsertSpecies.executeUpdate();
			}
			
			//Delete removed items from the database
			if(removedSpeciesMap.size()>0){
				Set<Integer> removedSpeciesKeys = removedSpeciesMap.keySet();
				String howManyQuestionMarks = removedSpeciesKeys.stream().map(k -> "?").collect(commaJoiner);
				String queryDeleteSpecies = "DELETE FROM `sample_species` WHERE `sample_id` = ? AND `species_id` IN ("+howManyQuestionMarks+")";
				PreparedStatement psDeleteSpecies = connection.prepareStatement(queryDeleteSpecies);
				psDeleteSpecies.setInt(1,sample.getId());
				int index = 2;
				for(int removedSpecies : removedSpeciesKeys) {
					psDeleteSpecies.setInt(index,removedSpecies);
					++index;
				}
				psDeleteSpecies.executeUpdate();
			}
			
			//Save changed values to the database
			//Delete removed items from the database
			Set<Integer> changedSpeciesKeys = changedSpeciesMap.keySet();
			String queryChangedSpecies = "UPDATE `sample_species` SET `value` = ? WHERE `sample_id` = ? AND `species_id` = ?";
			PreparedStatement psChangedSpecies = connection.prepareStatement(queryChangedSpecies);
			for(int changedSpecies : changedSpeciesKeys){
				psChangedSpecies.setInt(1, changedSpeciesMap.get(changedSpecies));
				psChangedSpecies.setInt(2, sample.getId());
				psChangedSpecies.setInt(3, changedSpecies);
				psChangedSpecies.executeUpdate();
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public void persist(List<? extends Sample> samples) throws RepositoryException {
		samples.forEach(this::persist);
	}
	
	@Override
	public void remove(int id) throws RepositoryException {
		try {
			String queryDeleteSpecies = "DELETE FROM `sample_species` WHERE `sample_id` = ?";
			PreparedStatement psDeleteSpecies = connection.prepareStatement(queryDeleteSpecies);
			psDeleteSpecies.setInt(1,id);
			psDeleteSpecies.executeUpdate();
			
			super.remove(id);
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public void remove(List<Integer> ids) throws RepositoryException {
		try {
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			String howManyQuestionMarks = ids.stream().map(id -> "?").collect(commaJoiner);
			String queryDeleteSpecies = "DELETE FROM `sample_species` WHERE `sample_id` IN (" + howManyQuestionMarks + ")";
			PreparedStatement psDeleteSpecies = connection.prepareStatement(queryDeleteSpecies);
			int index = 1;
			for (int id : ids) {
				psDeleteSpecies.setInt(index, id);
				++index;
			}
			psDeleteSpecies.executeUpdate();
			
			super.remove(ids);
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
}
