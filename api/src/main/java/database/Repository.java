package database;

import java.util.List;

/**
 * @author Wander Groeneveld
 * @version 0.2, 30-5-2017
 */
public interface Repository<T>{
	T get(int id) throws RepositoryException;
	List<T> get(List<Integer> ids) throws RepositoryException;
	List<T> getAll() throws RepositoryException;
	void persist(T entity) throws RepositoryException;
	void persist(List<T> entities) throws RepositoryException;
	void remove(int id) throws RepositoryException;
	void remove(List<Integer> ids) throws RepositoryException;
}
