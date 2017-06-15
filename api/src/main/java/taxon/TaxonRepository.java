package taxon;

import database.ColumnData;
import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * Repository for taxa
 *
 * @author Wander Groeneveld
 * @version 0.5, 14-6-2017
 */
public class TaxonRepository extends RepositoryMaria<Taxon>{
	private final String queryFindByName;
	
	public TaxonRepository(Connection connection) {
		super(connection);
		queryFindByName = "SELECT * FROM `"+getTable()+"` WHERE `name` LIKE ?";
	}
	
	private PreparedStatement psFindByName() throws SQLException {return connection.prepareStatement(queryFindByName);}
	
	@Override
	protected String getTable() {
		return "taxon";
	}
	
	@Override
	protected boolean isNew(Taxon entity) {
		return entity.getId()==0;
	}
	
	@Override
	protected Taxon createModel() {
		return new Taxon();
	}
	
	@Override
	protected ColumnData[] getColumns() {
		return new ColumnData[]{
				new ColumnData<>("id",Types.INTEGER, Taxon::getId, Taxon::setId,true),
				new ColumnData<>("name",Types.VARCHAR, Taxon::getName, Taxon::setName),
				new ColumnData<>("group_id",Types.INTEGER, Taxon::getGroupId, Taxon::setGroupId),
				new ColumnData<>("level_id",Types.INTEGER, Taxon::getLevelId, Taxon::setLevelId),
				new ColumnData<>("parent_id",Types.INTEGER, Taxon::getParentId, Taxon::setParentId),
				new ColumnData<>("refer_id",Types.INTEGER, Taxon::getReferId, Taxon::setReferId)
		};
	}
	
	/**
	 * Finds a taxon with a specified name
	 * @param name the name of the taxon to look for
	 * @return a taxon with the specified name, or null of none is found
	 * @throws RepositoryException when there was a problem retrieving the taxon
	 */
	public Taxon findByName(String name) throws RepositoryException {
		try {
			name = name.toLowerCase();
			PreparedStatement psFindByName = psFindByName();
			psFindByName.setString(1,name);
			ResultSet resultSet = psFindByName.executeQuery();
			if(resultSet!=null && resultSet.next()) {
				return resultSetToModel(resultSet);
			}
			else{
				return null;
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * Finds taxa with specified names
	 * @param names names of taxa to look for
	 * @return a list of taxa with the specified names
	 * @throws RepositoryException when there was a problem retrieving the taxa
	 */
	public List<Taxon> findByNames(List<String> names) throws RepositoryException {
		try {
			names.stream().map(String::toLowerCase);
			
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			String howManyQuestionMarks = names.stream().map(name -> "?").collect(commaJoiner);
			
			String queryFindByNameMulti = "SELECT * FROM `"+getTable()+"` WHERE `name` IN ("+howManyQuestionMarks+")";
			PreparedStatement psFindByNameMulti = connection.prepareStatement(queryFindByNameMulti);
			
			int index = 1;
			for(String name : names){
				psFindByNameMulti.setString(index,name);
				++index;
			}
			
			ResultSet resultSet = psFindByNameMulti.executeQuery();
			
			List<Taxon> taxa = new ArrayList<>();
			
			if(resultSet==null)
				return taxa;
			
			while(resultSet.next()){
				taxa.add(resultSetToModel(resultSet));
			}
			
			return taxa;
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	public List<Taxon> findChildren(List<Integer> ids)throws RepositoryException{
		try{
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			String howManyQuestionMarks = ids.stream().map(id -> "?").collect(commaJoiner);
			
			String queryFindChildren = "SELECT * FROM `"+getTable()+"` WHERE `parent_id` IN ("+howManyQuestionMarks+")";
			PreparedStatement psFindChildren = connection.prepareStatement(queryFindChildren);
			
			int index = 1;
			for(int id:ids){
				psFindChildren.setInt(index,id);
				++index;
			}
			
			ResultSet resultSet = psFindChildren.executeQuery();
			List<Taxon> taxa = new ArrayList<>();
			
			if(resultSet==null)
				return taxa;
			
			while(resultSet.next())
				taxa.add(resultSetToModel(resultSet));
			
			return taxa;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
}
