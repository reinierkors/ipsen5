package persistence;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * @author Dylan de Wit
 * @version 1.0, 10-4-2017
 */
abstract class ConnectionManager {
    Connection connection;
    private String username = "root";
    private String password = "hekken";
    private String url = "jdbc:mariadb://localhost:3306/waterscan";

    ConnectionManager() throws SQLException {
        try {
            Class.forName("org.mariadb.jdbc.Driver");
            connection = DriverManager.getConnection(url, username, password);
            System.out.println("Connection with database established.");
        } catch (ClassNotFoundException ex) {
            System.out.println(ex);
        }
    }
}