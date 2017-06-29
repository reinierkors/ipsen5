package taxon.level;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.Types;

/**
 * Repository for taxon levels
 *
 * @author Wander Groeneveld
 * @version 0.1, 13-6-2017
 */
public class TaxonLevelRepository extends RepositoryMaria<TaxonLevel>{
	
	public TaxonLevelRepository(Connection connection){
		super(connection);
	}
	
	@Override
	protected String getTable(){
		return "taxon_level";
	}
	
	@Override
	protected boolean isNew(TaxonLevel entity){
		return entity.getId() == 0;
	}
	
	@Override
	protected TaxonLevel createModel(){
		return new TaxonLevel();
	}
	
	@Override
	protected ColumnData[] getColumns(){
		return new ColumnData[]{new ColumnData<>("id", Types.INTEGER, TaxonLevel::getId, TaxonLevel::setId, true), new ColumnData<>("name", Types.VARCHAR, TaxonLevel::getName, TaxonLevel::setName)};
	}
}
