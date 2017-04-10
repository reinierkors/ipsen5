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
    private String url = "jdbc:mariadb://localhost:5432/waterscan";

    ConnectionManager() throws SQLException {
        try {
            Class.forName("org.mariadb.jdbc.Driver");
        } catch (ClassNotFoundException ex) {
            System.out.println(ex);
        }

        connection =
                DriverManager.getConnection(url, username, password);

        DatabaseMetaData dbmd = connection.getMetaData();

        System.out.println("DBMS: " + dbmd.getDatabaseProductName());
        System.out.println("Version: " + dbmd.getDatabaseProductVersion());
        System.out.println("Driver: " + dbmd.getDriverName() + " "
                + dbmd.getDriverVersion());
        System.out.println("Database: " + dbmd.getURL());
        System.out.println("User: " + dbmd.getUserName());
        System.out.println("\n\n");
    }
}