package taxon.group;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.Types;

/**
 * Repository for taxon groups
 *
 * @author Wander Groeneveld
 * @version 0.2, 17-6-2017
 */
public class TaxonGroupRepository extends RepositoryMaria<TaxonGroup>{
	
	public TaxonGroupRepository(Connection connection){
		super(connection);
	}
	
	@Override
	protected String getTable(){
		return "taxon_group";
	}
	
	@Override
	protected boolean isNew(TaxonGroup entity){
		return entity.getId() == 0;
	}
	
	@Override
	protected TaxonGroup createModel(){
		return new TaxonGroup();
	}
	
	@Override
	protected ColumnData[] getColumns(){
		return new ColumnData[]{new ColumnData<>("id", Types.INTEGER, TaxonGroup::getId, TaxonGroup::setId, true), new ColumnData<>("code", Types.VARCHAR, TaxonGroup::getCode, TaxonGroup::setCode), new ColumnData<>("description", Types.VARCHAR, TaxonGroup::getDescription, TaxonGroup::setDescription), new ColumnData<>("icon", Types.VARCHAR, TaxonGroup::getIcon, TaxonGroup::setIcon)};
	}
}
