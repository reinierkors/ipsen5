package database;

import api.ApiValidationException;

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
 * @version 0.3, 31-5-2017
 */
public abstract class RepositoryMaria<T> implements Repository<T>{
	private final Connection connection;
	
	private final PreparedStatement psGet,psGetAll,psRemove,psInsert,psUpdate;
	
	public RepositoryMaria(Connection connection){
		this.connection = connection;
		
		String getQuery = "SELECT * FROM `"+getTable()+"` WHERE `id` = ?";
		String getAllQuery = "SELECT * FROM `"+getTable()+"`";
		String removeQuery = "DELETE FROM `"+getTable()+"` WHERE `id` = ?";
		
		List<String> columns = Arrays.stream(getColumns()).filter(column -> !column.isPrimary()).map(ColumnData::getColumnName).collect(Collectors.toList());
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
	 * Creates an object that newly retrieved values will be stored in
	 * @return a model
	 */
	protected abstract T createModel();
	
	/**
	 * Information, getters and setters from all the columns in the table
	 * @return array of columns
	 */
	protected abstract ColumnData<T,?>[] getColumns();
	
	/**
	 * Fills parameters of the prepared statement with values from the model
	 * @param preparedStatement
	 * @param entity
	 * @param appendPrimary
	 * @throws RepositoryException
	 */
	protected void fillParameters(PreparedStatement preparedStatement, T entity, boolean appendPrimary) throws RepositoryException {
		try {
			int index = 1;
			for(ColumnData cd : this.getColumns()){
				if(cd.isPrimary())
					continue;
				if(cd.callGetter(entity)==null)
					preparedStatement.setNull(index,cd.getSqlType());
				else
					preparedStatement.setObject(index,cd.callGetter(entity),cd.getSqlType());
				++index;
			}
			
			if(appendPrimary){
				for(ColumnData cd : this.getColumns()) {
					if(!cd.isPrimary())
						continue;
					preparedStatement.setObject(index,cd.callGetter(entity),cd.getSqlType());
					++index;
				}
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * Creates a model instance from a result set
	 * @param resultSet
	 * @return a filled model instance
	 */
	protected T resultSetToModel(ResultSet resultSet) throws RepositoryException {
		try {
			T entity = createModel();
			for(ColumnData cd:getColumns()){
				cd.callSetter(entity,resultSet.getObject(cd.getColumnName()));
			}
			return entity;
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * Stores the auto increment keys in the entity
	 * @param entity
	 * @param generatedKeys
	 */
	protected void handleGeneratedKeys(T entity, ResultSet generatedKeys) throws RepositoryException {
		try {
			for(ColumnData cd:getColumns()) {
				if(cd.isPrimary()) {
					generatedKeys.next();
					cd.callSetter(entity,generatedKeys.getInt(cd.getColumnName()));
				}
			}
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	
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
			if(resultSet.next()) {
				return resultSetToModel(resultSet);
			}
			else{
				return null;
			}
		}
		catch(SQLException e){
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * Retrieve multiple rows by id from the database and return as model instance
	 * @param ids
	 * @return filled model instances found by the ids
	 * @throws RepositoryException
	 */
	@Override
	public List<T> get(List<Integer> ids) throws RepositoryException {
		try {
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			String howManyQuestionMarks = ids.stream().map(id -> "?").collect(commaJoiner);
			
			String getMultiQuery = "SELECT * FROM `"+getTable()+"` WHERE `id` IN ("+howManyQuestionMarks+")";
			PreparedStatement psGetMulti = connection.prepareStatement(getMultiQuery);
			
			int index = 1;
			for(int id:ids){
				psGetMulti.setInt(index,id);
				++index;
			}
			
			ResultSet resultSet = psGetMulti.executeQuery();
			List<T> list = new ArrayList<>();
			while(resultSet.next()) {
				list.add(resultSetToModel(resultSet));
			}
			return list;
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * @return all the rows from the database as model instances
	 * @throws RepositoryException
	 */
	@Override
	public List<T> getAll() throws RepositoryException {
		try{
			ResultSet resultSet = psGetAll.executeQuery();
			List<T> list = new ArrayList<>();
			while(resultSet.next()) {
				list.add(resultSetToModel(resultSet));
			}
			return list;
		}
		catch(SQLException e){
			throw new RepositoryException(e);
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
		} catch (SQLIntegrityConstraintViolationException e) {
			throw new ApiValidationException("Deze data is al aanwezig, controleer uw gegevens");
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
	public void persist(List<T> entities) throws RepositoryException {
		entities.forEach(this::persist);
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
	public void remove(List<Integer> ids) throws RepositoryException {
		try {
			Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
			String howManyQuestionMarks = ids.stream().map(id -> "?").collect(commaJoiner);
			
			String removeMultiQuery = "DELETE FROM `"+getTable()+"` WHERE `id` IN ("+howManyQuestionMarks+")";
			PreparedStatement psRemoveMulti = connection.prepareStatement(removeMultiQuery);
			
			int index = 1;
			for(int id:ids){
				psRemoveMulti.setInt(index,id);
				++index;
			}
			
			psRemoveMulti.executeUpdate();
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
}
