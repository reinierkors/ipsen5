package database;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * MariaDB implementation of the Repository interface
 *
 * @author Wander Groeneveld
 * @version 0.1, 20-5-2017
 */
public abstract class RepositoryMaria<T> implements Repository<T>{
	private final Connection connection;
	
	private final PreparedStatement psGet,psGetAll,psRemove,psRemoveMulti,psInsert,psUpdate;
	
	public RepositoryMaria(Connection connection){
		this.connection = connection;
		
		String getQuery = "SELECT * FROM `"+getTable()+"` WHERE `id` = ?";
		String getAllQuery = "SELECT * FROM `"+getTable()+"`";
		String removeQuery = "DELETE FROM `"+getTable()+"` WHERE `id` = ?";
		String removeMultiQuery = "DELETE FROM `"+getTable()+"` WHERE `id` IN(?)";
		
		List<String> columns = Arrays.stream(getColumns()).filter(column -> column!="id").collect(Collectors.toList());
		Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
		String columnList = columns.stream().map(column -> "`"+column+"`").collect(commaJoiner);
		String valueList = columns.stream().map(column -> "?").collect(commaJoiner);
		String updateList = columns.stream().map(column -> "`"+column+"` = ?").collect(commaJoiner);
		
		String insertQuery = "INSERT INTO `"+getTable()+"`("+columnList+") VALUES("+valueList+")";
		String updateQuery = "UPDATE `"+getTable()+"` SET "+updateList+" WHERE `id` = ?";
		
		try {
			psGet = connection.prepareStatement(getQuery);
			psGetAll = connection.prepareStatement(getAllQuery);
			psRemove = connection.prepareStatement(removeQuery);
			psRemoveMulti = connection.prepareStatement(removeMultiQuery);
			psInsert =  connection.prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS);
			psUpdate = connection.prepareStatement(updateQuery);
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * @return the name of the sql table
	 */
	protected abstract String getTable();
	
	/**
	 * Returns whether or not the entity is new (and thus needs to be inserted) or not (and needs to be updated)
	 * @param entity
	 * @return true if the entity does not yet exist in the database, false if it does exist
	 */
	protected abstract boolean isNew(T entity);
	
	/**
	 * Array of columns in the database table
	 * @return array of columns
	 */
	protected abstract String[] getColumns();
	
	/**
	 * Call the setInt, setString, etc for each column in the table, in the same order they are in getColumns()
	 * When appendId is true, add the id at the end
	 * @param preparedStatement
	 * @param appendId
	 */
	protected abstract void fillParameters(PreparedStatement preparedStatement,T entity,boolean appendId) throws RepositoryException;
	
	/**
	 * Creates a model instance from a result set
	 * @param resultSet
	 * @return a filled model instance
	 */
	protected abstract T resultSetToModel(ResultSet resultSet) throws RepositoryException;
	
	/**
	 * Stores the auto increment keys in the entity
	 * @param entity
	 * @param generatedKeys
	 */
	protected abstract void handleGeneratedKeys(T entity,ResultSet generatedKeys) throws RepositoryException;
	
	/**
	 * Retrieve a specific row from the database and returns it as model instance
	 * @param id
	 * @return a filled model instance found by the id
	 * @throws RepositoryException
	 */
	@Override
	public T get(int id) throws RepositoryException {
		try{
			psGet.setInt(1,id);
			ResultSet resultSet = psGet.executeQuery();
			resultSet.next();
			return resultSetToModel(resultSet);
		}
		catch(SQLException ex){
			throw new RepositoryException(ex);
		}
	}
	
	/**
	 * @return all the rows from the database as model instances
	 * @throws RepositoryException
	 */
	@Override
	public Iterable<T> getAll() throws RepositoryException {
		try{
			ResultSet resultSet = psGetAll.executeQuery();
			List<T> list = new ArrayList<T>();
			while(resultSet.next()) {
				list.add(resultSetToModel(resultSet));
			}
			return list;
		}
		catch(SQLException ex){
			throw new RepositoryException(ex);
		}
	}
	
	/**
	 * Saves the object to the database
	 * @param entity
	 * @throws RepositoryException
	 */
	@Override
	public void persist(T entity) throws RepositoryException {
		if(isNew(entity)){
			persistInsert(entity);
		}
		else{
			persistUpdate(entity);
		}
	}
	
	private void persistInsert(T entity) throws RepositoryException {
		try {
			fillParameters(psInsert, entity, false);
			psInsert.executeUpdate();
			handleGeneratedKeys(entity,psInsert.getGeneratedKeys());
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	private void persistUpdate(T entity) throws RepositoryException {
		try {
			fillParameters(psUpdate, entity, true);
			psUpdate.executeUpdate();
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * Saves the objects to the database
	 * TODO: optimise
	 * @param entities
	 * @throws RepositoryException
	 */
	@Override
	public void persist(Iterable<T> entities) throws RepositoryException {
		entities.forEach(entity -> persist(entity));
	}
	
	/**
	 * Removes the row with the specified id from the database
	 * @param id
	 * @throws RepositoryException
	 */
	@Override
	public void remove(int id) throws RepositoryException {
		try {
			psRemove.setInt(1,id);
			psRemove.executeUpdate();
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * Removes the rows with the specified ids from the database
	 * @param ids
	 * @throws RepositoryException
	 */
	@Override
	public void remove(Iterable<Integer> ids) throws RepositoryException {
		ArrayList<Integer> idsList = new ArrayList<>();
		for(int id:ids){
			idsList.add(id);
		}
		try {
			connection.createArrayOf("INT",idsList.toArray());
			psRemoveMulti.setArray(1,null);
			psRemoveMulti.executeUpdate();
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
}
