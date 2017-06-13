package taxon;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

import java.util.List;

/**
 * Service for taxon
 *
 * @author Wander Groeneveld
 * @version 0.2, 30-5-2017
 */
public class TaxonService {
	private static final TaxonService instance = new TaxonService();
	private final TaxonRepository repo;
	
	private TaxonService() {
		repo = new TaxonRepository(ConnectionManager.getInstance().getConnection());
	}
	
	public static TaxonService getInstance() {
		return instance;
	}
	
	/**
	 * Retrieves a taxon with a given id
	 * @param id the id of the taxon to return
	 * @return a Taxon object
	 * @throws ApiException when there was a problem retrieving the taxon or the taxon was not found
	 */
	public Taxon get(int id) throws ApiException {
		try {
			Taxon taxon = repo.get(id);
			if(taxon ==null) {
				throw new ApiException("Taxon does not exist");
			}
			return taxon;
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve taxon");
		}
	}
	
	/**
	 * Retrieves taxon with the given ids
	 * @param ids the ids of the taxon to return
	 * @return a list containing the taxon that were found
	 * @throws ApiException when there was a problem retrieving the taxon
	 */
	public List<Taxon> get(List<Integer> ids) throws ApiException {
		try {
			return repo.get(ids);
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve taxon");
		}
	}
	
	/**
	 * Finds a taxon by name or creates it if it doesn't exist
	 * @param name the name of the taxon
	 * @return a taxon object
	 * @throws ApiException when there was a problem finding or creating the taxon
	 */
	public Taxon findOrCreate(String name) throws ApiException{
		try {
			Taxon taxon = repo.findByName(name);
			if (taxon == null) {
				taxon = new Taxon(name);
				repo.persist(taxon);
			}
			return taxon;
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve taxon");
		}
	}
	
	/**
	 * Finds a taxon by name
	 * @param name the taxon name
	 * @return a taxon object with a given name or null if none was found
	 * @throws ApiException when there's a problem retrieving the taxon
	 */
	public Taxon find(String name) throws ApiException{
		try {
			return repo.findByName(name);
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve taxon");
		}
	}
	
	/**
	 * Stores a taxon object
	 * @param taxon the taxon object to store
	 * @return the taxon object after it's been saved
	 * @throws ApiException when there was a problem storing the taxon
	 */
	public Taxon save(Taxon taxon) throws ApiException{
		try {
			repo.persist(taxon);
			return taxon;
		} catch(RepositoryException e){
			throw new ApiException("Cannot save taxon");
		}
	}
	
}
