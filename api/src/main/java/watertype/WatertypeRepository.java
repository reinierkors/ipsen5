package watertype;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.Connection;

/**
 * Created by Dylan on 30-5-2017.
 */
public class WatertypeRepository extends RepositoryMaria<Watertype> {
    private final String TABLE = "watertype";
    private final String[] COLUMNS = new String[]{"id", "name", "code", "parent"};

    public WatertypeRepository(Connection connection) {
        super(connection);
    }

    @Override
    protected String getTable() {
        return TABLE;
    }

    @Override
    protected boolean isNew(Watertype entity) {
        return entity.getId() == 0;
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
