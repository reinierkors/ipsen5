package speciesCategory;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

/**
 * Service for species-categories
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class SpeciesCategoryService {
	private static final SpeciesCategoryService instance = new SpeciesCategoryService();
	private final SpeciesCategoryRepository repo;
	
	private SpeciesCategoryService() {
		repo = new SpeciesCategoryRepository(ConnectionManager.getInstance().getConnection());
		
	}
	
	public static SpeciesCategoryService getInstance() {
		return instance;
	}
	
	/**
	 * Retrieves a species category by name
	 * @param id the id of the species category
	 * @return the species category with the given id
	 * @throws ApiException when there's a problem retrieving the species category or it was not found
	 */
	public SpeciesCategory get(int id) throws ApiException {
		try {
			SpeciesCategory speciesCategory = repo.get(id);
			if(speciesCategory==null) {
				throw new ApiException("SpeciesCategory does not exist");
			}
			return speciesCategory;
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve speciesCategory");
		}
	}
	
	/**
	 * Retrieves all species categories
	 * @return a list of all species categories
	 * @throws ApiException when there was a problem retrieving all species categories
	 */
	public Iterable<SpeciesCategory> getAll() throws ApiException{
		try {
			return repo.getAll();
		} catch(RepositoryException e){
			throw new ApiException("Error retrieving all species categories");
		}
	}
}
