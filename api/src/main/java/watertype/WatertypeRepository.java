package watertype;

import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

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
    protected String[] getColumns() {
        return new String[0];
    }

    @Override
    protected void fillParameters(PreparedStatement preparedStatement, Watertype entity, boolean appendId) throws RepositoryException {

    }

    @Override
    protected Watertype resultSetToModel(ResultSet resultSet) throws RepositoryException {
        return null;
    }

    @Override
    protected void handleGeneratedKeys(Watertype entity, ResultSet generatedKeys) throws RepositoryException {

    }
}
