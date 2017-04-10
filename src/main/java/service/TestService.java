package service;

import model.TestModel;
import persistence.DatabaseAccess;
import persistence.TestDao;

import java.sql.SQLException;

public class TestService implements Service<TestModel> {

    private DatabaseAccess<TestModel> dao;

    public TestService() {
        try {
            dao = new TestDao();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void insert(TestModel model) {

    }

    @Override
    public TestModel retrieveSpecific(TestModel id) {
        return new TestModel();
    }

    @Override
    public TestModel retrieveAll() {
        return new TestModel();
    }

    @Override
    public void edit(TestModel id) {

    }

    @Override
    public void delete(TestModel id) {

    }
}
