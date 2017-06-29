package waterschap;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

/**
 * Waterschap service
 *
 * @author Wander Groeneveld, Dylan de Wit
 * @version 0.1, 30-5-2017
 */
public class WaterschapService{
	private static final WaterschapService instance = new WaterschapService();
	private final WaterschapRepository repo;

	private WaterschapService(){
		repo = new WaterschapRepository(ConnectionManager.getInstance().getConnection());
	}

	public static WaterschapService getInstance(){
		return instance;
	}

	/**
	 * Retrieves a list of all waterschap entities
	 *
	 * @return a list of all waterschap entities
	 * @throws ApiException
	 */
	public Iterable<Waterschap> getAll() throws ApiException{
		try{
			return repo.getAll();
		}
		catch(RepositoryException e){
			throw new ApiException("Cannot retrieve waterschappen");
		}
	}

	/**
	 * Retrieves a waterschap
	 *
	 * @param id the id of the waterschap to retrieve
	 * @return a waterschap with the given id
	 */
	public Waterschap get(int id){
		return repo.get(id);
	}

	public Waterschap save(Waterschap waterschap){
		try{
			repo.persist(waterschap);
			return waterschap;
		}
		catch(RepositoryException e){
			throw new ApiException("Cannot save Waterschap");
		}
	}
}
