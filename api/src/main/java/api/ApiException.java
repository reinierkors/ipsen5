package api;

/**
 * Exception which can be sent to the client
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class ApiException extends RuntimeException{
	public ApiException() {
	}
	
	public ApiException(String message) {
		super(message);
	}
	
	public ApiException(String message, Throwable cause) {
		super(message, cause);
	}
	
	public ApiException(Throwable cause) {
		super(cause);
	}
	
	public ApiException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}
	
	
}
