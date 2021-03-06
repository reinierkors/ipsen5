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
 * @version 0.7, 9-6-2017
 */
public abstract class RepositoryMaria<T> implements Repository<T>{
	protected final Connection connection;
	private final String queryGet,queryGetAll,queryRemove,queryInsert,queryUpdate,queryIsEmpty,queryRemoveAll;
	
	public RepositoryMaria(Connection connection){
		this.connection = connection;
		
		queryGet = "SELECT * FROM `"+getTable()+"` WHERE `id` = ?";
		queryGetAll = "SELECT * FROM `"+getTable()+"`"+(orderBy()==null?"":" ORDER BY "+orderBy());
		queryRemove = "DELETE FROM `"+getTable()+"` WHERE `id` = ?";
		queryIsEmpty = "SELECT NULL FROM `"+getTable()+"` LIMIT 1";
		queryRemoveAll = "DELETE FROM `"+getTable()+"`";
		
		List<String> columns = Arrays.stream(getColumns()).filter(column -> !column.isPrimary()).map(ColumnData::getColumnName).collect(Collectors.toList());
		Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
		String columnList = columns.stream().map(column -> "`"+column+"`").collect(commaJoiner);
		String valueList = columns.stream().map(column -> "?").collect(commaJoiner);
		String updateList = columns.stream().map(column -> "`"+column+"` = ?").collect(commaJoiner);
		
		queryInsert = "INSERT INTO `"+getTable()+"`("+columnList+") VALUES("+valueList+")";
		queryUpdate = "UPDATE `"+getTable()+"` SET "+updateList+" WHERE `id` = ?";
	}
	
	protected PreparedStatement psGet() throws SQLException {return connection.prepareStatement(queryGet);}
	protected PreparedStatement psGetAll() throws SQLException {return connection.prepareStatement(queryGetAll);}
	protected PreparedStatement psRemove() throws SQLException {return connection.prepareStatement(queryRemove);}
	protected PreparedStatement psInsert() throws SQLException {return connection.prepareStatement(queryInsert,Statement.RETURN_GENERATED_KEYS);}
	protected PreparedStatement psUpdate() throws SQLException {return connection.prepareStatement(queryUpdate);}
	protected PreparedStatement psIsEmpty() throws SQLException {return connection.prepareStatement(queryIsEmpty);}
	protected PreparedStatement psRemoveAll() throws SQLException {return connection.prepareStatement(queryRemoveAll);}
	
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
	protected abstract ColumnData<? extends T,?>[] getColumns();
	
	/**
	 * Override to change how getAll() orders its rows
	 * This string is added after "ORDER BY " in the query
	 * Example: `date` ASC
	 * @return a string to be placed after ORDER BY in a SELECT query
	 */
	protected String orderBy(){
		return null;
	}
	
	/**
	 * Fills parameters of the prepared statement with values from the model
	 * @param preparedStatement statement to add entity values in
	 * @param entity values of which should be added to the statement
	 * @param appendPrimary whether or not it should add the primary value to the end
	 * @throws RepositoryException when something goes wrong adding parameters to the prepared statement
	 */
	protected void fillParameters(PreparedStatement preparedStatement, T entity, boolean appendPrimary) throws RepositoryException {
		fillParameters(preparedStatement,1,entity,appendPrimary);
	}
	
	/**
	 * Fills parameters of the prepared statement with values from the model
	 * @param preparedStatement statement to add entity values in
	 * @param statementStartIndex at what index should it start filling the parameters
	 * @param entity values of which should be added to the statement
	 * @param appendPrimary whether or not it should add the primary value to the end
	 * @throws RepositoryException when something goes wrong adding parameters to the prepared statement
	 */
	protected void fillParameters(PreparedStatement preparedStatement, int statementStartIndex, T entity, boolean appendPrimary) throws RepositoryException {
		try {
			int index = statementStartIndex;
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
	 * @param resultSet a resultset out of which the values for the entity come
	 * @return a filled model instance
	 */
	protected T resultSetToModel(ResultSet resultSet) throws RepositoryException {
		if(resultSet==null)
			return null;
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
	 * @param entity the entity to store the generated keys in
	 * @param generatedKeys resultset containing the generated keys
	 */
	protected void handleGeneratedKeys(T entity, ResultSet generatedKeys) throws RepositoryException {
		if(generatedKeys==null)
			return;
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
	 * @param id the id of the row to retrieve
	 * @return a filled model instance found by the id
	 * @throws RepositoryException when there's a problem retrieving the row
	 */
	@Override
	public T get(int id) throws RepositoryException {
		try{
			PreparedStatement psGet = psGet();
			psGet.setInt(1,id);
			ResultSet resultSet = psGet.executeQuery();
			if(resultSet!=null && resultSet.next()) {
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
	 * @param ids the ids of the rows to retrieve
	 * @return filled model instances found by the ids
	 * @throws RepositoryException when there's a problem retrieving the rows
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
			if(resultSet==null)
				return list;
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
	 * @throws RepositoryException when there's a problem retrieving the rows
	 */
	@Override
	public List<T> getAll() throws RepositoryException {
		try{
			PreparedStatement psGetAll = psGetAll();
			ResultSet resultSet = psGetAll.executeQuery();
			List<T> list = new ArrayList<>();
			if(resultSet==null)
				return list;
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
	 * @param entity the entity to be stored in the database
	 * @throws RepositoryException when there's a problem storing the entity
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
	
	/**
	 * Uses INSERT to save the entity to the database and stores any generated keys in the entity
	 * @param entity the entity to be inserted
	 * @throws RepositoryException when there's a problem inserting the entity
	 */
	private void persistInsert(T entity) throws RepositoryException {
		try {
			PreparedStatement psInsert = psInsert();
			fillParameters(psInsert, entity, false);
			psInsert.executeUpdate();
			handleGeneratedKeys(entity,psInsert.getGeneratedKeys());
		} catch (SQLIntegrityConstraintViolationException e) {
			//ToDo: different exception or message depending on the error (foreign key vs null vs duplicate value, etc)
			throw new ApiValidationException("SQL Constraint Violation ("+e.getSQLState()+"): "+e.getMessage());
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * Uses UPDATE to save the entity to the database
	 * @param entity the entity to be updated
	 * @throws RepositoryException when there's a problem updating the entity
	 */
	private void persistUpdate(T entity) throws RepositoryException {
		try {
			PreparedStatement psUpdate = psUpdate();
			fillParameters(psUpdate, entity, true);
			psUpdate.executeUpdate();
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * Saves the objects to the database
	 * @param entities list of entities to be saved
	 * @throws RepositoryException when there's a problem saving the entities
	 */
	@Override
	public void persist(List<? extends T> entities) throws RepositoryException {
		List<T> newEntities = new ArrayList<>();
		List<T> updatedEntities = new ArrayList<>();
		
		entities.forEach((T entity) -> {
			if(isNew(entity)){
				newEntities.add(entity);
			}
			else{
				updatedEntities.add(entity);
			}
		});
		persistUpdate(updatedEntities);
		persistInsert(newEntities);
	}
	
	/**
	 * Uses INSERT to save the entities to the database, does this in batches of 1000 entities
	 * @param entities the entities to be inserted
	 * @throws RepositoryException when there's a problem inserting the entities
	 */
	private void persistInsert(List<? extends T> entities) throws RepositoryException {
		if(entities.isEmpty()){
			return;
		}
		
		//Split the list in sub-lists of no more than 1000 entities
		int listSize = entities.size();
		int subSize = 1000;
		int howManySubs = (listSize/subSize)+(listSize%subSize==0?0:1);
		List<List<? extends T>> subs = new ArrayList<>();
		
		for(int i=0;i<howManySubs;++i){
			int startIndex = i*subSize;
			int endIndex = (i+1)*subSize;
			endIndex = Math.min(endIndex,listSize);
			subs.add(entities.subList(startIndex,endIndex));
		}
		
		try {
			//Save each sub-list
			for(List<? extends T> sub : subs) {
				Collector<CharSequence, ?, String> commaJoiner = Collectors.joining(",");
				List<ColumnData> usedColumns = Arrays.stream(getColumns()).filter(cd -> !cd.isPrimary()).collect(Collectors.toList());
				
				String columnList = usedColumns.stream().map(cd -> "`"+cd.getColumnName()+"`").collect(commaJoiner);
				String valueListSingle = "(" + usedColumns.stream().filter(cd -> !cd.isPrimary()).map(cd -> "?").collect(commaJoiner) + ")";
				String valueList = sub.stream().map(ent -> valueListSingle).collect(commaJoiner);
				
				String queryInsertMulti = "INSERT INTO `" + getTable() + "` (" + columnList + ") VALUES " + valueList;
				PreparedStatement psInsertMulti = connection.prepareStatement(queryInsertMulti);
				
				int index = 1;
				for (T entity : sub) {
					fillParameters(psInsertMulti, index, entity, false);
					index += usedColumns.size();
				}
				psInsertMulti.executeUpdate();
				ResultSet generatedKeys = psInsertMulti.getGeneratedKeys();
				for (T entity : sub) {
					handleGeneratedKeys(entity, generatedKeys);
				}
			}
		} catch (SQLIntegrityConstraintViolationException e) {
			//ToDo: different exception or message depending on the error (foreign key vs null vs duplicate value, etc)
			throw new ApiValidationException("SQL Constraint Violation ("+e.getSQLState()+"): "+e.getMessage());
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * Uses UPDATE to save the entities to the database
	 * ToDO: optimise
	 * @param entities the entities to be updated in the database
	 * @throws RepositoryException when there's a problem updating the entities
	 */
	private void persistUpdate(List<? extends T> entities) throws RepositoryException {
		entities.forEach(this::persistUpdate);
	}
	
	/**
	 * Removes the row with the specified id from the database
	 * @param id the id of the row to be removed
	 * @throws RepositoryException when there's a problem removing the row
	 */
	@Override
	public void remove(int id) throws RepositoryException {
		try {
			PreparedStatement psRemove = psRemove();
			psRemove.setInt(1,id);
			psRemove.executeUpdate();
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * Removes the rows with the specified ids from the database
	 * @param ids the ids of the rows to be removed
	 * @throws RepositoryException when there's a problem removing the rows
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
	
	/**
	 * Checks if the table is empty
	 * @return true if there are no rows in the table
	 */
	public boolean isEmpty(){
		try{
			PreparedStatement psIsEmpty = psIsEmpty();
			ResultSet resultSet = psIsEmpty.executeQuery();
			return resultSet==null || !resultSet.next();
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
	
	/**
	 * Removes all rows in the table
	 */
	public void emptyTable(){
		try{
			PreparedStatement psRemoveAll = psRemoveAll();
			psRemoveAll.executeUpdate();
		} catch (SQLException e) {
			throw new RepositoryException(e);
		}
	}
}
