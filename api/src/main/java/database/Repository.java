package database;

import java.util.List;

/**
 * A basic repository interface
 * @author Wander Groeneveld
 * @version 0.3, 5-6-2017
 */
public interface Repository<T>{
	/**
	 * Retrieve an entity with the given id
	 * @param id unique id of the entity
	 * @return an entity with the given id or null if none is found
	 * @throws RepositoryException when there's a problem retrieving the entity
	 */
	T get(int id) throws RepositoryException;
	
	/**
	 * Retrieves the entities with the given ids
	 * @param ids list of unique ids of the entities
	 * @return a list with entities with the given ids, when none are found an empty list is returned
	 * @throws RepositoryException when there's a problem retrieving the entities
	 */
	List<T> get(List<Integer> ids) throws RepositoryException;
	
	/**
	 * Retrieves all entities in this repository
	 *
	 * @return a list containing all entities in this repository
	 * @throws RepositoryException when there's a problem retrieving the entities
	 */
	List<T> getAll() throws RepositoryException;
	
	/**
	 * Stores the entity in the repository.
	 * Used for both updating existing entities and storing new ones.
	 * @param entity the entity to store
	 * @throws RepositoryException when there's a problem storing the entity
	 */
	void persist(T entity) throws RepositoryException;
	
	/**
	 * Stores the entities in the repository.
	 * Used for both updating existing entities and storing new ones.
	 * @param entities list of entities to store
	 * @throws RepositoryException when there's a problem storing the entities
	 */
	void persist(List<? extends T> entities) throws RepositoryException;
	
	/**
	 * Removes the entity with the given id from the repository
	 * @param id the id of the entity to remove
	 * @throws RepositoryException when there's a problem removing the entity
	 */
	void remove(int id) throws RepositoryException;
	
	/**
	 * Removes the entities with the given ids from the repository
	 * @param ids the ids of the entities to remove
	 * @throws RepositoryException when there's a problem removing the entities
	 */
	void remove(List<Integer> ids) throws RepositoryException;
}
