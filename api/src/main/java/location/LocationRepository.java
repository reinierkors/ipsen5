package location;

import database.RepositoryException;
import database.RepositoryMaria;
import javafx.scene.control.Tab;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Location repository
 *
 * @author Dylan de Wit
 * @version 0.1, 24-5-2017
 */
public class LocationRepository extends RepositoryMaria<Location> {
    private final String TABLE = "location";
    private final String[] COLUMNS = new String[]{"id", "code", "description",
            "x-coordinate", "y-coordinate", "latitude", "longitude"};

    public LocationRepository(Connection connection) {
        super(connection);
    }

    @Override
    protected String getTable() {
        return TABLE;
    }

    @Override
    protected boolean isNew(Location entity) {
        return entity.getId() == 0;
    }

    @Override
    protected String[] getColumns() {
        return new String[]{"id", "code", "description",
                "x-coordinate", "y-coordinate", "latitude", "longitude"};
    }

    @Override
    protected void fillParameters(PreparedStatement preparedStatement, Location entity, boolean appendId) throws RepositoryException {
        try {
            preparedStatement.setString(1, entity.getCode());
            preparedStatement.setString(2, entity.getDescription());
            preparedStatement.setInt(3, entity.getxCoord());
            preparedStatement.setInt(4, entity.getyCoord());
            preparedStatement.setBigDecimal(5, entity.getLatitude());
            preparedStatement.setBigDecimal(6, entity.getLongitude());
            if (appendId)
                preparedStatement.setInt(7, entity.getId());
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }

    @Override
    protected Location resultSetToModel(ResultSet resultSet) throws RepositoryException {
        try {
            Location location = new Location();
            location.setId(resultSet.getInt(COLUMNS[0]));
            location.setCode(resultSet.getString(COLUMNS[1]));
            location.setDescription(resultSet.getString(COLUMNS[2]));
            location.setxCoord(resultSet.getInt(COLUMNS[3]));
            location.setyCoord(resultSet.getInt(COLUMNS[4]));
            location.setLatitude(resultSet.getBigDecimal(COLUMNS[5]));
            location.setLongitude(resultSet.getBigDecimal(COLUMNS[6]));
            return location;
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }

    @Override
    protected void handleGeneratedKeys(Location entity, ResultSet generatedKeys) throws RepositoryException {
        try {
            generatedKeys.next();
            entity.setId(generatedKeys.getInt("id"));
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }
}
