package reference;

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
 * Repository for references
 *
 * @author Wander Groeneveld
 * @version 0.1, 19-6-2017
 */
public class ReferenceRepository extends RepositoryMaria<Reference>{
	private final String queryGetTaxa, queryGetByWatertype;
	
	public ReferenceRepository(Connection connection){
		super(connection);
		queryGetTaxa = "SELECT `taxon_id` FROM `reference_taxon` WHERE `reference_id` = ?";
		queryGetByWatertype = "SELECT * FROM `" + getTable() + "` WHERE `watertype_id` = ?";
	}
	
	@Override
	protected String getTable(){
		return "reference";
	}
	
	@Override
	protected boolean isNew(Reference entity){
		return entity.getId() == 0;
	}
	
	@Override
	protected Reference createModel(){
		return new Reference();
	}
	
	@Override
	protected ColumnData[] getColumns(){
		return new ColumnData[]{new ColumnData<>("id", Types.INTEGER, Reference::getId, Reference::setId, true), new ColumnData<>("watertype_id", Types.INTEGER, Reference::getWatertypeId, Reference::setWatertypeId),};
	}
	
	@Override
	public Reference get(int id) throws RepositoryException{
		try{
			Reference reference = super.get(id);
			if(reference == null)
				return null;
			
			addReferenceTaxa(reference);
			
			return reference;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	public Reference getByWatertype(int watertypeId) throws RepositoryException{
		try{
			PreparedStatement psGetByWT = connection.prepareStatement(queryGetByWatertype);
			psGetByWT.setInt(1, watertypeId);
			
			ResultSet resultSet = psGetByWT.executeQuery();
			if(resultSet == null || !resultSet.next())
				throw new RepositoryException("No reference with this watertype exists");
			
			Reference reference = resultSetToModel(resultSet);
			addReferenceTaxa(reference);
			
			return reference;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public List<Reference> get(List<Integer> ids) throws RepositoryException{
		try{
			List<Reference> references = super.get(ids);
			if(references.isEmpty())
				return references;
			
			addReferenceTaxa(references);
			
			return references;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public List<Reference> getAll() throws RepositoryException{
		try{
			List<Reference> references = super.getAll();
			if(references.isEmpty())
				return references;
			
			addReferenceTaxa(references);
			
			return references;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	private void addReferenceTaxa(Reference reference) throws SQLException{
		//Retrieve taxon ids, and put them in the reference object
		PreparedStatement psGetTaxa = connection.prepareStatement(queryGetTaxa);
		psGetTaxa.setInt(1, reference.getId());
		ResultSet resultSet = psGetTaxa.executeQuery();
		
		List<Integer> taxa = new ArrayList<>();
		if(resultSet != null){
			while(resultSet.next()){
				taxa.add(resultSet.getInt("taxon_id"));
			}
		}
		reference.setTaxonIds(taxa);
	}
	
	private void addReferenceTaxa(List<Reference> references) throws SQLException{
		//Retrieve taxon ids, and put them in the reference object
		Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
		String howManyQuestionMarks = references.stream().map(reference -> "?").collect(commaJoiner);
		
		String queryGetTaxaMulti = "SELECT `reference_id`,`taxon_id` FROM `reference_taxon` WHERE `reference_id` IN (" + howManyQuestionMarks + ")";
		PreparedStatement psGetTaxaMulti = connection.prepareStatement(queryGetTaxaMulti);
		
		Map<Integer, List<Integer>> referenceIdToTaxaMap = new HashMap<>();
		int index = 1;
		for(Reference reference : references){
			List<Integer> taxa = new ArrayList<>();
			referenceIdToTaxaMap.put(reference.getId(), taxa);
			reference.setTaxonIds(taxa);
			psGetTaxaMulti.setInt(index, reference.getId());
			++index;
		}
		
		ResultSet resultSet = psGetTaxaMulti.executeQuery();
		if(resultSet != null){
			while(resultSet.next()){
				int referenceId = resultSet.getInt("reference_id");
				int taxonId = resultSet.getInt("taxon_id");
				referenceIdToTaxaMap.get(referenceId).add(taxonId);
			}
		}
	}
	
	@Override
	public void persist(Reference reference) throws RepositoryException{
		try{
			super.persist(reference);
			
			//Save reference taxa
			
			//Taxa in database before saving
			List<Integer> oldTaxa;
			//Taxa we want in the database
			List<Integer> newTaxa = reference.getTaxonIds();
			if(newTaxa == null){
				newTaxa = new ArrayList();
				reference.setTaxonIds(newTaxa);
			}
			//Taxa that have been removed
			List<Integer> removedTaxa;
			//Taxa that have been added
			List<Integer> addedTaxa;
			
			//Read old rows from the database
			PreparedStatement psGetTaxa = connection.prepareStatement(queryGetTaxa);
			psGetTaxa.setInt(1, reference.getId());
			ResultSet resultSet = psGetTaxa.executeQuery();
			oldTaxa = new ArrayList<>();
			if(resultSet != null){
				while(resultSet.next()){
					oldTaxa.add(resultSet.getInt("taxon_id"));
				}
			}
			
			//Check which taxa are new
			addedTaxa = new ArrayList<>(newTaxa);
			addedTaxa.removeAll(oldTaxa);
			
			//Check which taxon are removed
			removedTaxa = new ArrayList<>(oldTaxa);
			removedTaxa.removeAll(newTaxa);
			
			//Save added items to the database
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			if(addedTaxa.size() > 0){
				String valueParams = addedTaxa.stream().map(k -> "(?,?)").collect(commaJoiner);
				String queryInsertTaxa = "INSERT INTO `reference_taxon`(`reference_id`,`taxon_id`) VALUES " + valueParams;
				PreparedStatement psInsertTaxa = connection.prepareStatement(queryInsertTaxa);
				int index = 1;
				for(int addedTaxon : addedTaxa){
					psInsertTaxa.setInt(index, reference.getId());
					++index;
					psInsertTaxa.setInt(index, addedTaxon);
					++index;
				}
				psInsertTaxa.executeUpdate();
			}
			
			//Delete removed items from the database
			if(removedTaxa.size() > 0){
				String howManyQuestionMarks = removedTaxa.stream().map(k -> "?").collect(commaJoiner);
				String queryDeleteTaxa = "DELETE FROM `reference_taxon` WHERE `reference_id` = ? AND `taxon_id` IN (" + howManyQuestionMarks + ")";
				PreparedStatement psDeleteTaxa = connection.prepareStatement(queryDeleteTaxa);
				psDeleteTaxa.setInt(1, reference.getId());
				int index = 2;
				for(int removedTaxon : removedTaxa){
					psDeleteTaxa.setInt(index, removedTaxon);
					++index;
				}
				psDeleteTaxa.executeUpdate();
			}
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	@Override
	public void persist(List<? extends Reference> references) throws RepositoryException{
		references.forEach(this::persist);
	}
	
	@Override
	public void remove(int id) throws RepositoryException{
		try{
			String queryDeleteTaxon = "DELETE FROM `reference_taxon` WHERE `reference_id` = ?";
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
			String queryDeleteTaxon = "DELETE FROM `reference_taxon` WHERE `reference_id` IN (" + howManyQuestionMarks + ")";
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
}
