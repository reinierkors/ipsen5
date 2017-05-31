package watertype;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.Types;

/**
 * Created by Dylan on 30-5-2017.
 */
public class WatertypeRepository extends RepositoryMaria<Watertype> {
    private final String TABLE = "watertype";

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
        return new Watertype();
    }

    @Override
    protected ColumnData[] getColumns() {
        return new ColumnData[]{
                new ColumnData<>("id", Types.INTEGER, Watertype::getId, Watertype::setId, true),
                new ColumnData<>("name", Types.VARCHAR, Watertype::getName, Watertype::setName),
                new ColumnData<>("code", Types.VARCHAR, Watertype::getCode, Watertype::setCode),
                new ColumnData<>("parent", Types.INTEGER, Watertype::getParentId, Watertype::setParentId)
        };
    }
}
