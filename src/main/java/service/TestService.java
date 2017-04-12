package service;

import model.TestModel;
import persistence.DatabaseAccess;
import persistence.TestDao;

import java.util.ArrayList;

public class TestService implements Service<TestModel> {

    private DatabaseAccess<TestModel> dao;

    public TestService() {
        dao = new TestDao();
    }

    @Override
    public void insert(TestModel model) {

    }

    @Override
    public TestModel retrieveSpecific(TestModel id) {
        return new TestModel();
    }

    @Override
    public ArrayList<TestModel> retrieveAll() {
        return new ArrayList<>();
    }

    @Override
    public void edit(TestModel id) {

    }

    @Override
    public void delete(TestModel id) {

    }
}
