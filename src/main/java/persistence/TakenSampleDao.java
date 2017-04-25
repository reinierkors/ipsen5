package persistence;

import model.TakenSample;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 * Created by Dylan on 25-4-2017.
 */
public class TakenSampleDao implements DatabaseAccess<TakenSample> {
    private Connection connection;
    private PreparedStatement retrieveAll;

    public TakenSampleDao() {
        connection = ConnectionManager.getInstance().getConnection();
        try {
            prepareAllStatements();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void prepareAllStatements() throws SQLException {
        retrieveAll = connection.prepareStatement("SELECT * FROM taken_sample_new");
    }

    @Override
    public void insert(TakenSample model) {

    }

    @Override
    public TakenSample retrieveSpecific(TakenSample id) {
        return null;
    }

    @Override
    public ArrayList<TakenSample> retrieveAll() throws SQLException {
        ArrayList<TakenSample> samples = new ArrayList<>();
        ResultSet resultSet = retrieveAll.executeQuery();

        while (resultSet.next()) {
            samples.add(handleResult(resultSet));
        }
       return samples;
    }

    public ArrayList<ArrayList<TakenSample>> retrieveAllTemp() throws SQLException {
        ArrayList<ArrayList<TakenSample>> samples = new ArrayList<>();
        ResultSet resultSet = retrieveAll.executeQuery();
        String previousSampleDate = "";
        ArrayList<TakenSample> sample = new ArrayList<>();

        while (resultSet.next()) {
            if (previousSampleDate.equals("") || previousSampleDate.equals(resultSet.getString("date"))) {
                sample.add(handleResult(resultSet));
                previousSampleDate = sample.get(sample.size() - 1).getDate();
            } else {
                samples.add(sample);
                sample = new ArrayList<>();
                previousSampleDate = "";
            }
        }
        return samples;
    }

    @Override
    public void edit(TakenSample id) {

    }

    @Override
    public void delete(TakenSample id) {

    }

    @Override
    public TakenSample handleResult(ResultSet resultSet) throws SQLException {
        TakenSample sample = new TakenSample();
        sample.setMp(resultSet.getString("mp"));
        sample.setLocation(resultSet.getString("location"));
        sample.setWaterCode(resultSet.getString("water_code"));
        sample.setWaterName(resultSet.getString("water_name"));
        sample.setKrwCode(resultSet.getString("krw_code"));
        sample.setKrwName(resultSet.getString("krw_name"));
        sample.setLongitude(resultSet.getString("longitude"));
        sample.setLatitude(resultSet.getString("latitude"));
        sample.setDate(resultSet.getString("date"));
        sample.setTime("");
        sample.setMethodCode(resultSet.getString("method_code"));
        sample.setMethodeName(resultSet.getString("method_name"));
        sample.setMethodUnit(resultSet.getString("method_unit"));
        sample.setTaxonName(resultSet.getString("taxon_name"));
        sample.setValue(resultSet.getString("value"));
        return sample;
    }
}
