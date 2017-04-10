package persistence;

import model.TestModel;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Created by Dylan on 10-4-2017.
 */
public class TestDao extends ConnectionManager implements DatabaseAccess<TestModel> {
    Connection connection = super.connection;

    public TestDao() throws SQLException {
    }

    @Override
    public void insert(TestModel model) {
    }

    @Override
    public TestModel retrieveSpecific(TestModel id) {
        return null;
    }

    @Override
    public TestModel retrieveAll() {
        return null;
    }

    @Override
    public void edit(TestModel id) {

    }

    @Override
    public void delete(TestModel id) {

    }
}
