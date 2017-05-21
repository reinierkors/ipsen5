package species;

import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

/**
 * Repository for species categories
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class SpeciesCategoryRepository extends RepositoryMaria<SpeciesCategory>{
	public SpeciesCategoryRepository(Connection connection) {
		super(connection);
	}
	
	@Override
	protected String getTable() {
		return "species_category";
	}
	
	@Override
	protected boolean isNew(SpeciesCategory entity) {
		return entity.getId()==0;
	}
	
	@Override
	protected String[] getColumns() {
		return new String[]{"id","name"};
	}
	
	@Override
	protected void fillParameters(PreparedStatement preparedStatement, SpeciesCategory entity, boolean appendId) throws RepositoryException {
		try {
			preparedStatement.setString(1,entity.getName());
			if(appendId) {
				preparedStatement.setInt(2, entity.getId());
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected SpeciesCategory resultSetToModel(ResultSet resultSet) throws RepositoryException {
		try {
			SpeciesCategory speciesCategory = new SpeciesCategory();
			speciesCategory.setId(resultSet.getInt("id"));
			speciesCategory.setName(resultSet.getString("name"));
			return speciesCategory;
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	@Override
	protected void handleGeneratedKeys(SpeciesCategory entity, ResultSet generatedKeys) throws RepositoryException {
		try {
			generatedKeys.next();
			entity.setId(generatedKeys.getInt("id"));
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
}
