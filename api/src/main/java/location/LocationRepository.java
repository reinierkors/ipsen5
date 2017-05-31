package location;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.*;

/**
 * Location repository
 *
 * @author Dylan de Wit
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
        };
    }
}
