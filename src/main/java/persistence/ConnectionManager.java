package persistence;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * This class is used to create a connection with the database. This is used
 * so that we don't have to create a connection in every single DAO.
 * This is a singleton class.
 *
 * @author Dylan de Wit
 * @version 1.0, 10-4-2017
 */
abstract class ConnectionManager {
    Connection connection;
    private String username = "root";
    private String password = "admin";
    private String url = "jdbc:mariadb://localhost:3306/waterscan";

    ConnectionManager() throws SQLException {
        try {
            Class.forName("org.mariadb.jdbc.Driver");
            connection = DriverManager.getConnection(url, username, password);
            System.out.print("Connection with database established");
        } catch (ClassNotFoundException ex) {
            System.out.println(ex);
        }
    }
}