package watertype;

import api.ApiException;
import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

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
    protected String[] getColumns() {
        return new String[]{"id", "name", "code", "parent"};
    }

    @Override
    protected void fillParameters(PreparedStatement preparedStatement, Watertype entity, boolean appendId) throws RepositoryException {
        try {
            if (appendId) {
                preparedStatement.setInt(1, entity.getId());
            }
            preparedStatement.setString(2, entity.getName());
            preparedStatement.setString(3, entity.getCode());
            preparedStatement.setInt(4, entity.getParentId());
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }

    @Override
    protected Watertype resultSetToModel(ResultSet resultSet) throws RepositoryException {
        Watertype watertype = new Watertype();
        try {
            watertype.setId(resultSet.getInt(COLUMNS[0]));
            watertype.setName(resultSet.getString(COLUMNS[1]));
            watertype.setCode(resultSet.getString(COLUMNS[2]));
            watertype.setParentId(resultSet.getInt(COLUMNS[3]));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return watertype;
    }

    @Override
    protected void handleGeneratedKeys(Watertype entity, ResultSet generatedKeys) throws RepositoryException {
        try {
            generatedKeys.next();
            entity.setId(generatedKeys.getInt("id"));
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }
}
