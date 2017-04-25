package service;

import model.TakenSample;
import persistence.TakenSampleDao;

import java.sql.SQLException;
import java.util.ArrayList;

/**
 * Created by Dylan on 25-4-2017.
 */
public class TakenSampleService implements Service<TakenSample> {
    private TakenSampleDao dao;

    public TakenSampleService() {
        dao = new TakenSampleDao();
    }

    @Override
    public void insert(TakenSample model) {

    }

    @Override
    public TakenSample retrieveSpecific(TakenSample id) {
        return null;
    }

    @Override
    public ArrayList<TakenSample> retrieveAll() {
        ArrayList<TakenSample> samples = new ArrayList<>();
        try {
            samples = dao.retrieveAll();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return samples;
    }

    public ArrayList<ArrayList<TakenSample>> retrieveAllTemp() {
        ArrayList<ArrayList<TakenSample>> samples = new ArrayList<>();
        try {
            samples = dao.retrieveAllTemp();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return samples;
    }

    @Override
    public void edit(TakenSample id) {

    }

    @Override
    public void delete(TakenSample id) {

    }
}
