package persistence;

import model.AveragePerSample;
import model.TakenSample;
import model.Taxon;

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
    private PreparedStatement insertSample;

    private TaxonDao taxonDao;

    public TakenSampleDao() {
        connection = ConnectionManager.getInstance().getConnection();
        try {
            prepareAllStatements();
            taxonDao = new TaxonDao();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void prepareAllStatements() throws SQLException {
        retrieveAll = connection.prepareStatement("SELECT * FROM taken_sample_new");
        insertSample = connection.prepareStatement("INSERT INTO taken_sample_new" +
                "(mp, location, water_code, water_name, krw_code, krw_name, " +
                "longitude, latitude, date, time, method_code, method_name, " +
                "method_unit, taxon_name, value)"
                + " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    }

    @Override
    public void insert(TakenSample model) throws SQLException {
        insertSample.setString(1, model.getMp());
        insertSample.setString(2, model.getLocation());
        insertSample.setString(3, model.getWaterCode());
        insertSample.setString(4, model.getWaterName());
        insertSample.setString(5, model.getKrwCode());
        insertSample.setString(6, model.getKrwName());
        insertSample.setString(7, model.getLongitude());
        insertSample.setString(8, model.getLatitude());
        insertSample.setString(9, model.getDate());
        insertSample.setString(10, "");
        insertSample.setString(11, model.getMethodCode());
        insertSample.setString(12, model.getMethodeName());
        insertSample.setString(13, model.getMethodUnit());
        insertSample.setString(14, model.getTaxonName());
        insertSample.setString(15, model.getValue());
        System.out.println(insertSample.toString());
        insertSample.executeUpdate();
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

    public ArrayList<AveragePerSample> retrieveAllAverageSamples() throws SQLException {
        ArrayList<ArrayList<TakenSample>> samples = new ArrayList<>();
        ResultSet resultSet = retrieveAll.executeQuery();
        String previousSampleDate = "";
        ArrayList<TakenSample> sample = new ArrayList<>();

        AveragePerSample averagePerSample = new AveragePerSample();
        ArrayList<AveragePerSample> averagePerSamples = new ArrayList<>();

        while (resultSet.next()) {
            if (previousSampleDate.equals("") || previousSampleDate.equals(resultSet.getString("date"))) {
                TakenSample takenSample = handleResult(resultSet);
                averagePerSample.appendTaxons(taxonDao.retrieveSpecificTaxon(takenSample.getTaxonName()));
                sample.add(takenSample);
                previousSampleDate = sample.get(sample.size() - 1).getDate();
            } else {
                samples.add(sample);
                sample = new ArrayList<>();
                previousSampleDate = "";

                averagePerSamples.add(averagePerSample);
                averagePerSample = new AveragePerSample();
            }
        }

        for(AveragePerSample averageSample : averagePerSamples) {
            averageSample.calculateAverages();
        }
        return averagePerSamples;
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
