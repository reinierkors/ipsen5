package waterschap;

import database.ColumnData;
import database.RepositoryMaria;

import java.sql.*;

/**
 * Repository for waterschap
 *
 * @author Wander Groeneveld
 * @version 0.2, 31-5-2017
 */
public class WaterschapRepository extends RepositoryMaria<Waterschap> {
    public WaterschapRepository(Connection connection) {
        super(connection);
    }

    @Override
    protected String getTable() {
        return "waterschap";
    }

    @Override
    protected boolean isNew(Waterschap entity) {
        return entity.getId() == 0;
    }

    @Override
    protected Waterschap createModel() {
        return new Waterschap();
    }

    @Override
    protected ColumnData[] getColumns() {
        return new ColumnData[]{
                new ColumnData<>("id", Types.INTEGER, Waterschap::getId, Waterschap::setId, true),
                new ColumnData<>("name", Types.VARCHAR, Waterschap::getName, Waterschap::setName),
                new ColumnData<>("address", Types.VARCHAR, Waterschap::getAddress, Waterschap::setAddress),
                new ColumnData<>("house_number", Types.INTEGER, Waterschap::getHouseNumber, Waterschap::setHouseNumber),
                new ColumnData<>("zip_code", Types.VARCHAR, Waterschap::getZipCode, Waterschap::setZipCode),
                new ColumnData<>("location", Types.VARCHAR, Waterschap::getLocation, Waterschap::setLocation),
                new ColumnData<>("phone_number", Types.VARCHAR, Waterschap::getPhoneNumber, Waterschap::setPhoneNumber)
        };
    }
}
