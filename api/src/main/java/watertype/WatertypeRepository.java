package watertype;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.Types;

/**
 * Repository for watertype
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.3, 4-6-2017
 */
public class WatertypeRepository extends RepositoryMaria<Watertype> {
    public WatertypeRepository(Connection connection) {
        super(connection);
    }

    @Override
    protected String getTable() {
        return "watertype";
    }

    @Override
    protected boolean isNew(Watertype entity) {
        return entity.getId()==0;
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
                new ColumnData<>("code", Types.VARCHAR, Watertype::getCode, Watertype::setCode)
        };
    }
}
