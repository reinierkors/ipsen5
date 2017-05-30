package database;

import config.Config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 1.1, 17-5-2017
 */
public class ConnectionManager {
	private static ConnectionManager instance;
	private Connection connection;
	private Config.Api.Database dbConfig;
	
	private ConnectionManager() throws SQLException {
		dbConfig = Config.getInstance().api.database;
		
		try{
			initConnection();
		} catch (ClassNotFoundException ex) {
			System.out.println(ex);
		}
	}

	private void initConnection() throws SQLException, ClassNotFoundException{
		switch(dbConfig.driver){
			case "mariadb":
				Class.forName("org.mariadb.jdbc.Driver");
				break;
			//TODO add mysql driver
			//case "mysql":
			//	break;
			default:
				throw new SQLException("Invalid driver specified");
		}
		connection = DriverManager.getConnection(getUrl(), dbConfig.username, dbConfig.password);
		System.out.println("Connection with database established.");
	}

	private String getUrl(){
		return "jdbc:"+dbConfig.driver+"://"+dbConfig.host+":"+dbConfig.port+"/"+dbConfig.database;
	}
	
	public Connection getConnection() {
		return connection;
	}
	
	public void reconnect() throws SQLException, ClassNotFoundException{
		if(!connection.isClosed()){
			connection.close();
		}
		initConnection();
	}
	
	public static ConnectionManager getInstance() {
		if (instance == null) {
			try {
				instance = new ConnectionManager();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return instance;
	}
}
