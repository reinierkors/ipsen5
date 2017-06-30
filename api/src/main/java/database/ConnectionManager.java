package database;

import config.Config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Singleton that opens a database connection
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 1.1, 17-5-2017
 */
public class ConnectionManager{
	private static ConnectionManager instance;
	private Connection connection;
	private final Config.Api.Database dbConfig;
	
	private ConnectionManager() throws SQLException{
		dbConfig = Config.getInstance().api.database;
		
		try{
			initConnection();
		}
		catch(ClassNotFoundException ex){
			ex.printStackTrace();
		}
	}
	
	/**
	 * Get the instance of this class
	 *
	 * @return ConnectionManager instance
	 */
	public static ConnectionManager getInstance(){
		if(instance == null){
			try{
				instance = new ConnectionManager();
			}
			catch(SQLException e){
				e.printStackTrace();
			}
		}
		return instance;
	}
	
	/**
	 * Opens a database connection
	 *
	 * @throws SQLException
	 * @throws ClassNotFoundException
	 */
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
	
	/**
	 * The URL used in DriverManager.getConnection filled with properties from the config
	 *
	 * @return a jdbc url
	 */
	private String getUrl(){
		return "jdbc:" + dbConfig.driver + "://" + dbConfig.host + ":" + dbConfig.port + "/" + dbConfig.database;
	}
	
	/**
	 * Returns an open database connection
	 *
	 * @return connection
	 */
	public Connection getConnection(){
		return connection;
	}
	
	/**
	 * Starts a new database connection
	 *
	 * @throws SQLException
	 * @throws ClassNotFoundException
	 */
	public void reconnect() throws SQLException, ClassNotFoundException{
		if(!connection.isClosed()){
			connection.close();
		}
		initConnection();
	}
}
