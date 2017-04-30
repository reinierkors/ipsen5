package persistence;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 * Created by Dylan on 10-4-2017.
 */
public interface DatabaseAccess<T> {
    void prepareAllStatements() throws SQLException;

    void insert(T model) throws SQLException;

    T retrieveSpecific(T id);

    ArrayList<T> retrieveAll() throws SQLException;

    void edit(T id);

    void delete(T id);

    T handleResult(ResultSet resultSet) throws SQLException;
}
