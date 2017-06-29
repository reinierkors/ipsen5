package watertype;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

/**
 * Watertype service
 *
 * @author Dylan de Wit
 * @author Wander Groeneveld
 * @version 0.3, 1-6-2017
 */
public class WatertypeService{
	private static final WatertypeService instance = new WatertypeService();
	private final WatertypeRepository repo;
	
	private WatertypeService(){
		repo = new WatertypeRepository(ConnectionManager.getInstance().getConnection());
	}
	
	public static WatertypeService getInstance(){
		return instance;
	}
	
	/**
	 * Retrieve a watertype by id
	 *
	 * @param id the id of the watertype to retrieve
	 * @return a watertype object
	 */
	public Watertype get(int id){
		return repo.get(id);
	}
	
	/**
	 * Retrieves all watertypes
	 *
	 * @return a list of all watertypes
	 * @throws ApiException when there was a problem retrieving the watertypes
	 */
	public Iterable<Watertype> getAll() throws ApiException{
		try{
			return repo.getAll();
		}
		catch(RepositoryException e){
			throw new ApiException("Cannot retrieve watertypes");
		}
	}
	
	/**
	 * Store a watertype
	 *
	 * @param watertype the watertype object to store
	 * @return the watertype object after it's been stored
	 * @throws ApiException when there was a problem storing the watertype
	 */
	public Watertype save(Watertype watertype) throws ApiException{
		try{
			repo.persist(watertype);
			return watertype;
		}
		catch(RepositoryException e){
			throw new ApiException("Cannot save watertypes");
		}
	}
}
