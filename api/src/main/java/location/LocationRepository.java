package location;

import database.ColumnData;
import database.RepositoryException;
import database.RepositoryMaria;

import java.sql.*;

/**
 * Location repository
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.2, 31-5-2017
 */
public class LocationRepository extends RepositoryMaria<Location> {
    private final String TABLE = "location";
    private final PreparedStatement psFindByCode;
    
    public LocationRepository(Connection connection) {
        super(connection);
    
        String findByCodeQuery = "SELECT * FROM `"+getTable()+"` WHERE `code` LIKE ?";
    
        try {
            psFindByCode = connection.prepareStatement(findByCodeQuery);
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
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
                new ColumnData<>("watertype_id", Types.INTEGER, Location::getWatertypeId, Location::setWatertypeId)
        };
    }
    
    public Location findByCode(String code) throws RepositoryException {
        try {
            psFindByCode.setString(1,code);
            ResultSet resultSet = psFindByCode.executeQuery();
            if(resultSet.next()) {
                return resultSetToModel(resultSet);
            }
            else{
                return null;
            }
        } catch (SQLException e) {
            throw new RepositoryException(e);
        }
    }
}
