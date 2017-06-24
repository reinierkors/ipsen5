package location;

import database.ColumnData;
import database.RepositoryException;
import database.RepositoryMaria;
import sample.Sample;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Location repository
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.3, 4-6-2017
 */
public class LocationRepository extends RepositoryMaria<Location> {
    private final String findByCodeQuery;

    public LocationRepository(Connection connection) {
        super(connection);

        findByCodeQuery = "SELECT * FROM `" + getTable() + "` WHERE `code` LIKE ?";
    }

    protected PreparedStatement psFindByCode() throws SQLException {
        return connection.prepareStatement(findByCodeQuery);
    }

    @Override
    protected String getTable() {
        return "location";
    }

    @Override
    protected boolean isNew(Location entity) {
        return entity.getId() == 0;
    }

    @Override
    protected Location createModel() {
        return new Location();
    }

    @Override
    protected ColumnData[] getColumns() {
        return new ColumnData[]{
                new ColumnData<>("id", Types.INTEGER, Location::getId, Location::setId, true),
                new ColumnData<>("code", Types.VARCHAR, Location::getCode, Location::setCode),
                new ColumnData<>("description", Types.VARCHAR, Location::getDescription, Location::setDescription),
                new ColumnData<>("x_coor", Types.INTEGER, Location::getxCoord, Location::setxCoord),
                new ColumnData<>("y_coor", Types.INTEGER, Location::getyCoord, Location::setyCoord),
                new ColumnData<>("waterschap_id", Types.INTEGER, Location::getWaterschapId, Location::setWaterschapId),
                new ColumnData<>("watertype_id", Types.INTEGER, Location::getWatertypeId, Location::setWatertypeId),
                new ColumnData<>("watertype_krw_id", Types.INTEGER, Location::getWatertypeKrwId, Location::setWatertypeKrwId)
        };
    }

    /**
     * Finds a location with the given code
     *
     * @param code a unique location code
     * @return the location object or null if none is found
     * @throws RepositoryException when there's a problem retrieving the location from the database
     */
    public Location findByCode(String code) throws RepositoryException {
        try {
            PreparedStatement psFindByCode = psFindByCode();
            psFindByCode.setString(1, code);
            ResultSet resultSet = psFindByCode.executeQuery();
            if (resultSet != null && resultSet.next()) {
                return resultSetToModel(resultSet);
            } else {
                return null;
            }
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }

    public List<Location> getByFilters(Integer watertypeId, Integer waterschapId, String date) {
        try {
            List<Location> locations = new ArrayList<>();
            String getLocationsStr = "SELECT * FROM location JOIN sample ON " +
                    "location.id = sample.location_id WHERE 1 = 1 ";
            if (waterschapId != 0) {
                getLocationsStr += " AND location.waterschap_id = ?";
            }

            if (watertypeId != 0) {
                getLocationsStr += " AND (location.watertype_id = ? OR location.watertype_krw_id = ?)";
            }

            if (!date.equals("")) {
                getLocationsStr += " AND year(sample.date) >= ?";
            }
            getLocationsStr += " GROUP BY location.description";
            PreparedStatement getLocations = connection.prepareStatement(getLocationsStr);
            int paramCounter = 1;

            if (waterschapId != 0) {
                getLocations.setInt(paramCounter, waterschapId);
                paramCounter++;
            }

            if (watertypeId != 0) {
                getLocations.setInt(paramCounter, watertypeId);
                paramCounter++;
                getLocations.setInt(paramCounter, watertypeId);
                paramCounter++;
            }

            if (!date.equals("")) {
                getLocations.setString(paramCounter, date);
                paramCounter++;
            }
            ResultSet resultSet = getLocations.executeQuery();

            if (resultSet != null) {
                while (resultSet.next()) {
                    locations.add(resultSetToModel(resultSet));
                }
            }
            return locations;
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }
}
