package database;

/**
 * @author Wander Groeneveld
 * @version 0.1, 20-5-2017
 */
public interface Repository<T>{
	T get(int id) throws RepositoryException;
	Iterable<T> getAll() throws RepositoryException;
	void persist(T entity) throws RepositoryException;
	void persist(Iterable<T> entities) throws RepositoryException;
	void remove(int id) throws RepositoryException;
	void remove(Iterable<Integer> ids) throws RepositoryException;
}
