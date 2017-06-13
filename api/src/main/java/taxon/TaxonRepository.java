package taxon;

import database.ColumnData;
import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.*;

/**
 * Repository for taxon
 *
 * @author Wander Groeneveld
 * @version 0.4, 13-6-2017
 */
public class TaxonRepository extends RepositoryMaria<Taxon>{
	private final String queryFindByName;
	
	public TaxonRepository(Connection connection) {
		super(connection);
		queryFindByName = "SELECT * FROM `"+getTable()+"` WHERE `name` LIKE ?";
	}
	
	PreparedStatement psFindByName() throws SQLException {return connection.prepareStatement(queryFindByName);}
	
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
}
