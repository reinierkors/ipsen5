package locations;

import database.RepositoryException;
import database.RepositoryMaria;
import locations.Location;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * Repository for samples
 *
 * @author Johan Kruishoop
 * @version 0.1, 24-5-2017
 */
public class LocationRepository extends RepositoryMaria<Location> {
    public LocationRepository(Connection connection) {
        super(connection);
    }

    @Override
    protected String getTable() {
        return null;
    }

    @Override
    protected boolean isNew(Location entity) {
        return false;
    }

    @Override
    protected String[] getColumns() {
        return new String[0];
    }

    @Override
    protected void fillParameters(PreparedStatement preparedStatement, Location entity, boolean appendId) throws RepositoryException {

    }

    @Override
    protected Location resultSetToModel(ResultSet resultSet) throws RepositoryException {
        return null;
    }

    @Override
    protected void handleGeneratedKeys(Location entity, ResultSet generatedKeys) throws RepositoryException {

    }
}
