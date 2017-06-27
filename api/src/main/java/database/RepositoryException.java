package database;

/**
 * An exception for when something goes wrong in a repository.
 * Hides exceptions of specific repository implementations.
 * @author Wander Groeneveld
 * @version 0.1, 20-5-2017
 */
public class RepositoryException extends RuntimeException{
	public RepositoryException() {
	}
	
	public RepositoryException(String message) {
		super(message);
	}
	
	public RepositoryException(String message, Throwable cause) {
		super(message, cause);
	}
	
	public RepositoryException(Throwable cause) {
		super(cause);
	}
	
	public RepositoryException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}
}
