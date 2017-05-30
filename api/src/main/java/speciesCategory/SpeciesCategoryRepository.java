package speciesCategory;

import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Repository for species categories
 *
 * @author Wander Groeneveld
 * @version 0.2, 30-5-2017
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
		return new String[]{"id","name","parent"};
	}
	
	@Override
	protected void fillParameters(PreparedStatement preparedStatement, SpeciesCategory entity, boolean appendId) throws RepositoryException {
		try {
			preparedStatement.setString(1,entity.getName());
			preparedStatement.setInt(2,entity.getParent());
			if(appendId) {
				preparedStatement.setInt(3, entity.getId());
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
			speciesCategory.setParent(resultSet.getInt("parent"));
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
