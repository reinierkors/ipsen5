package persistence;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * @author Dylan de Wit
 * @version 1.0, 10-4-2017
 */
class ConnectionManager {
    private static ConnectionManager instance;
    private Connection connection;
    private final String USERNAME = "root";
    private final String PASSWORD = "root";
    private final String URL = "jdbc:mariadb://localhost:3306/waterscan";

    static ConnectionManager getInstance() {
        if (instance == null) {
            try {
                instance = new ConnectionManager();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return instance;
    }

    private ConnectionManager() throws SQLException {
        try {
            Class.forName("org.mariadb.jdbc.Driver");
            connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
            System.out.println("Connection with database established.");
        } catch (ClassNotFoundException ex) {
            System.out.println(ex);
        }
    }

    Connection getConnection() {
        return connection;
    }

}
