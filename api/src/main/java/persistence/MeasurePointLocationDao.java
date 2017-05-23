package persistence;

import model.MeasurePointLocation;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 * Created by Kruishoop on 23-5-2017.
 */
public class MeasurePointLocationDao implements DatabaseAccess<MeasurePointLocationDao> {
    private Connection connection;
    private PreparedStatement retrieveAll;

    public MeasurePointLocationDao() {
        connection = ConnectionManager.getInstance().getConnection();
        try {
            prepareAllStatements();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void prepareAllStatements() throws SQLException {
        retrieveAll = connection.prepareStatement("SELECT location.code, " +
                "waterschap.name, " +
                "location.latitude, " +
                "location.longitude \n" +
                "FROM location\n" +
                "INNER JOIN waterschap ON location.waterschap_id = waterschap.id;");
    }

    @Override
    public void insert(MeasurePointLocationDao model) throws SQLException {
        // no need to insert, new locations are added when a sample is added
    }

    @Override
    public MeasurePointLocationDao retrieveSpecific(MeasurePointLocationDao id) {
        return null;
        // this method retrieves all individual measurement locations
    }

    @Override
    public ArrayList<MeasurePointLocationDao> retrieveAll() throws SQLException {
        ArrayList<MeasurePointLocationDao> locations = new ArrayList<>();
        ResultSet rs = retrieveAll.executeQuery();

        while(rs.next()){
            locations.add(handleResult(rs));
        }
        return locations;
    }

    @Override
    public void edit(MeasurePointLocationDao id) {
        // nog niks
    }

    @Override
    public void delete(MeasurePointLocationDao id) {
        //nog niks
    }

    @Override
    public MeasurePointLocationDao handleResult(ResultSet resultSet) throws SQLException {
        MeasurePointLocation location = new MeasurePointLocation();
        location.setCode(resultSet.getCode("code"));
        location.setWaterschap(resultSet.getWaterschap("waterschap"));
        location.setLatitude(resultSet.getLatitude("latitude"));
        location.setLongitude(resultSet.getLongitude("longitude"));
        return location;
    }
}
