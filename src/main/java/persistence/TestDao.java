package persistence;

import model.TestModel;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 * Created by Dylan on 10-4-2017.
 */
public class TestDao implements DatabaseAccess<TestModel> {

    private Connection connection;

    public TestDao() {
        connection = ConnectionManager.getInstance().getConnection();
    }

    @Override
    public void prepareAllStatements() throws SQLException {

    }

    @Override
    public void insert(TestModel model) {
    }

    @Override
    public TestModel retrieveSpecific(TestModel id) {
        return null;
    }

    @Override
    public ArrayList<TestModel> retrieveAll() {
        return null;
    }

    @Override
    public void edit(TestModel id) {

    }

    @Override
    public void delete(TestModel id) {

    }

    @Override
    public TestModel handleResult(ResultSet resultSet) throws SQLException {
        return null;
    }
}
