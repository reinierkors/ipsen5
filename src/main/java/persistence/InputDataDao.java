package persistence;

import model.TakenSample;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 * Created by Kruishoop on 27-4-2017.
 */
public class InputDataDao implements DatabaseAccess<TakenSample> {
    private Connection connection;
    private PreparedStatement writeData;

    public InputDataDao() {
        connection = ConnectionManager.getInstance().getConnection();
        try {
            prepareAllStatements();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void prepareAllStatements() throws SQLException {
        //Something here
    }

    @Override
    public void insert(TakenSample model) {
        //Something here
    }

    @Override
    public TakenSample retrieveSpecific(TakenSample id) {
        return null;
    }

    @Override
    public ArrayList<TakenSample> retrieveAll() throws SQLException {
        return null;
    }

    @Override
    public void edit(TakenSample id) {

    }

    @Override
    public void delete(TakenSample id) {

    }

    @Override
    public TakenSample handleResult(ResultSet resultSet) throws SQLException {
        return null;
    }
}
