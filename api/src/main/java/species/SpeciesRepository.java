package species;

import database.ColumnData;
import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.*;

/**
 * Repository for species
 *
 * @author Wander Groeneveld
 * @version 0.3, 5-6-2017
 */
public class SpeciesRepository extends RepositoryMaria<Species>{
	private final String queryFindByName;
	
	public SpeciesRepository(Connection connection) {
		super(connection);
		queryFindByName = "SELECT * FROM `"+getTable()+"` WHERE `name` LIKE ?";
	}
	
	PreparedStatement psFindByName() throws SQLException {return connection.prepareStatement(queryFindByName);}
	
	public Species findByName(String name) throws RepositoryException {
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
	
	@Override
	protected String getTable() {
		return "species";
	}
	
	@Override
	protected boolean isNew(Species entity) {
		return entity.getId()==0;
	}
	
	@Override
	protected Species createModel() {
		return new Species();
	}
	
	@Override
	protected ColumnData[] getColumns() {
		return new ColumnData[]{
				new ColumnData<>("id",Types.INTEGER,Species::getId,Species::setId,true),
				new ColumnData<>("name",Types.VARCHAR,Species::getName,Species::setName),
				new ColumnData<>("category_id",Types.INTEGER,Species::getCategoryId,Species::setCategoryId)
		};
	}
}
