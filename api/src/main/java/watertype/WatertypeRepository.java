package watertype;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.Connection;

/**
 * Created by Dylan on 30-5-2017.
 */
public class WatertypeRepository extends RepositoryMaria<Watertype> {
    public WatertypeRepository(Connection connection) {
        super(connection);
    }

    @Override
    protected String getTable() {
        return null;
    }

    @Override
    protected boolean isNew(Watertype entity) {
        return false;
    }
    
    @Override
    protected Watertype createModel() {
        return null;
    }
    
    @Override
    protected ColumnData[] getColumns() {
        return new ColumnData[0];
    }
}
