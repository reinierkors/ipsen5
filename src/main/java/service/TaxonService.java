package service;

import model.Taxon;
import persistence.DatabaseAccess;
import persistence.TaxonDao;

import java.sql.SQLException;
import java.util.ArrayList;

/**
 * Created by Dylan on 12-4-2017.
 */
public class TaxonService implements Service<Taxon> {
    private DatabaseAccess<Taxon> dao;

    public TaxonService() {
        try {
            dao = new TaxonDao();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void insert(Taxon model) {

    }

    @Override
    public Taxon retrieveSpecific(Taxon id) {
        return null;
    }

    @Override
    public ArrayList<Taxon> retrieveAll() {
        ArrayList<Taxon> taxons = new ArrayList<>();
        try {
            taxons = dao.retrieveAll();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return taxons;
    }

    @Override
    public void edit(Taxon id) {

    }

    @Override
    public void delete(Taxon id) {

    }
}
