package locations;

import database.RepositoryException;
import database.RepositoryMaria;
import locations.Location;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

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
        return "location";
    }

    @Override
    protected boolean isNew(Location entity) {
        return false;
    }

    @Override
    protected String[] getColumns() {
        return new String[]{"code","waterschap","latitude","longitude"};
    }

    @Override
    protected void fillParameters(PreparedStatement preparedStatement, Location entity, boolean appendId) throws RepositoryException {

    }

    @Override
    protected Location resultSetToModel(ResultSet resultSet) throws RepositoryException {
        try {
            Location location = new Location();
            location.setId(resultSet.getInt("id"));
            location.setCode(resultSet.getString("code"));
            location.setDescription(resultSet.getString("description"));
            location.setWaterschap_id(resultSet.getInt("waterschap_id"));
            location.setLatitude(resultSet.getBigDecimal("latitude"));
            location.setLongitude(resultSet.getBigDecimal("longitude"));
            return location;
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }

    @Override
    protected void handleGeneratedKeys(Location entity, ResultSet generatedKeys) throws RepositoryException {

    }
}
