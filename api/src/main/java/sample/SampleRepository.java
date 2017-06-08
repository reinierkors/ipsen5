package sample;

import database.ColumnData;
import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * Repository for samples
 *
 * @author Wander Groeneveld
 * @version 0.3, 3-6-2017
 */
public class SampleRepository extends RepositoryMaria<Sample>{
	private final String queryGetSpecies;
	
	public SampleRepository(Connection connection) {
		super(connection);
		queryGetSpecies = "SELECT `species_id` FROM `sample_species` WHERE `sample_id` = ?";
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
			//Retrieve species ids and put them in the sample object
			PreparedStatement psGetSpecies = connection.prepareStatement(queryGetSpecies);
			psGetSpecies.setInt(1,sample.getId());
			ResultSet resultSet = psGetSpecies.executeQuery();
			
			List<Integer> speciesIds = new ArrayList<>();
			if(resultSet!=null){
				while(resultSet.next()){
					speciesIds.add(resultSet.getInt("species_id"));
				}
			}
			sample.setSpeciesIds(speciesIds);
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
			
			//Retrieve species ids and put them in the sample object
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			String howManyQuestionMarks = samples.stream().map(sample -> "?").collect(commaJoiner);
			
			String queryGetSpeciesMulti = "SELECT `sample_id`,`species_id` FROM `sample_species` WHERE `sample_id` IN ("+howManyQuestionMarks+")";
			PreparedStatement psGetSpeciesMulti = connection.prepareStatement(queryGetSpeciesMulti);
			
			Map<Integer,List<Integer>> sampleIdToSpeciesListMap = new HashMap<>();
			int index = 1;
			for(Sample sample:samples){
				List<Integer> list = new ArrayList<>();
				sampleIdToSpeciesListMap.put(sample.getId(),list);
				sample.setSpeciesIds(list);
				psGetSpeciesMulti.setInt(index,sample.getId());
				++index;
			}
			
			ResultSet resultSet = psGetSpeciesMulti.executeQuery();
			if(resultSet!=null) {
				while(resultSet.next()){
					int sampleId = resultSet.getInt("sample_id");
					int speciesId = resultSet.getInt("species_id");
					sampleIdToSpeciesListMap.get(sampleId).add(speciesId);
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
			
			//Save sample species
			//Retrieve species ids to compare new values
			PreparedStatement psGetSpecies = connection.prepareStatement(queryGetSpecies);
			psGetSpecies.setInt(1,sample.getId());
			ResultSet resultSet = psGetSpecies.executeQuery();
			List<Integer> oldSpeciesIds = new ArrayList<>();
			if(resultSet!=null){
				while(resultSet.next()){
					oldSpeciesIds.add(resultSet.getInt("species_id"));
				}
			}
			List<Integer> currentSpeciesIds = sample.getSpeciesIds();
			//Find out what's added and removed
			List<Integer> addedSpeciesIds = new ArrayList<>(currentSpeciesIds);
			addedSpeciesIds.removeAll(oldSpeciesIds);
			List<Integer> removedSpeciesIds = new ArrayList<>(oldSpeciesIds);
			removedSpeciesIds.removeAll(currentSpeciesIds);
			//Save changes to database
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			if(addedSpeciesIds.size()>0){
				String valueParams = addedSpeciesIds.stream().map(id -> "(?,?)").collect(commaJoiner);
				String queryInsertSpecies = "INSERT INTO `sample_species`(`sample_id`,`species_id`) VALUES "+valueParams;
				PreparedStatement psInsertSpecies = connection.prepareStatement(queryInsertSpecies);
				int index = 1;
				for(int addedSpeciesId:addedSpeciesIds) {
					psInsertSpecies.setInt(index,sample.getId());
					++index;
					psInsertSpecies.setInt(index,addedSpeciesId);
					++index;
				}
				psInsertSpecies.executeUpdate();
			}
			if(removedSpeciesIds.size()>0){
				String howManyQuestionMarks = removedSpeciesIds.stream().map(id -> "?").collect(commaJoiner);
				String queryDeleteSpecies = "DELETE FROM `sample_species` WHERE `sample_id` = ? AND `species_id` IN ("+howManyQuestionMarks+")";
				PreparedStatement psDeleteSpecies = connection.prepareStatement(queryDeleteSpecies);
				psDeleteSpecies.setInt(1,sample.getId());
				int index = 2;
				for(int removedSpeciesId:removedSpeciesIds) {
					psDeleteSpecies.setInt(index,removedSpeciesId);
					++index;
				}
				psDeleteSpecies.executeUpdate();
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public void persist(List<Sample> samples) throws RepositoryException {
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

	public List<Sample> getByLocationId(int id) {
		try {
			Sample sample = new Sample();
			List<Sample> samples = new ArrayList<>();
			//Retrieve species ids and put them in the sample object
			String getSampelsByLocation = "SELECT * FROM sample WHERE location_id = ?";
			PreparedStatement getLocations = connection.prepareStatement(getSampelsByLocation);
			getLocations.setInt(1, id);
			ResultSet resultSet = getLocations.executeQuery();

			if(resultSet!=null){
				while(resultSet.next()){
					samples.add(sample);
				}
			}
			return samples;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
}
