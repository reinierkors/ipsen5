package speciesCategory;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.*;

/**
 * Repository for species categories
 *
 * @author Wander Groeneveld
 * @version 0.3, 31-5-2017
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
	protected SpeciesCategory createModel() {
		return new SpeciesCategory();
	}
	
	@Override
	protected ColumnData[] getColumns() {
		return new ColumnData[]{
				new ColumnData<>("id", Types.INTEGER, SpeciesCategory::getId,SpeciesCategory::setId,true),
				new ColumnData<>("name", Types.VARCHAR, SpeciesCategory::getName,SpeciesCategory::setName),
				new ColumnData<>("parent", Types.INTEGER, SpeciesCategory::getParent,SpeciesCategory::setParent)
		};
	}
}
