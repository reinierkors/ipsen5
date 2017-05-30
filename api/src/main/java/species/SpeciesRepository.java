package species;

import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.*;

/**
 * Repository for species
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class SpeciesRepository extends RepositoryMaria<Species>{
	private final PreparedStatement psFindByName;
	
	public SpeciesRepository(Connection connection) {
		super(connection);
		
		String findByNameQuery = "SELECT * FROM `"+getTable()+"` WHERE `name` LIKE ?";
		
		try {
			psFindByName = connection.prepareStatement(findByNameQuery);
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	public Species findByName(String name) throws RepositoryException {
		try {
			psFindByName.setString(1,name);
			ResultSet resultSet = psFindByName.executeQuery();
			if(resultSet.next()) {
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
	protected String[] getColumns() {
		return new String[]{"id","name","category_id"};
	}
	
	@Override
	protected void fillParameters(PreparedStatement preparedStatement, Species entity, boolean appendId) throws RepositoryException {
		try {
			preparedStatement.setString(1,entity.getName());
			if(entity.getCategoryId()==null)
				preparedStatement.setNull(2, Types.INTEGER);
			else
				preparedStatement.setInt(2,entity.getCategoryId());
			
			if(appendId) {
				preparedStatement.setInt(3, entity.getId());
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected Species resultSetToModel(ResultSet resultSet) throws RepositoryException {
		try {
			Species species = new Species();
			species.setId(resultSet.getInt("id"));
			species.setName(resultSet.getString("name"));
			species.setCategoryId(resultSet.getInt("category_id"));
			return species;
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected void handleGeneratedKeys(Species entity, ResultSet generatedKeys) throws RepositoryException {
		try {
			generatedKeys.next();
			entity.setId(generatedKeys.getInt("id"));
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
}
