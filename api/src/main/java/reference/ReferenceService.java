package reference;

import api.ApiException;
import calculate.CalculateService;
import database.ConnectionManager;
import database.RepositoryException;

import java.util.List;

/**
 * Service for references
 *
 * @author Wander Groeneveld
 * @version 0.1, 19-6-2017
 */
public class ReferenceService {
	private static final ReferenceService instance = new ReferenceService();
	private final ReferenceRepository repo;
	private final CalculateService calcService;
	
	private ReferenceService() {
		repo = new ReferenceRepository(ConnectionManager.getInstance().getConnection());
		calcService = CalculateService.getInstance();
	}
	
	public static ReferenceService getInstance() {
		return instance;
	}
	
	/**
	 * Retrieve reference with the specified by
	 * @param id the id of the reference to be retrieved
	 * @return a reference
	 * @throws ApiException when there's a problem retrieving the reference, or the reference does not exist
	 */
	public Reference get(int id) throws ApiException {
		try {
			Reference reference = repo.get(id);
			if(reference==null) {
				throw new ApiException("Reference does not exist");
			}
			return reference;
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve reference");
		}
	}
	
	/**
	 * Retrieves a list of all references
	 * @return a list of all references
	 * @throws ApiException when there was a problem retrieving the references
	 */
	public List<Reference> getAll() throws ApiException{
		try{
			return repo.getAll();
		}
		catch(RepositoryException e){
			throw new ApiException("Cannot retrieve references");
		}
	}
	
	public Reference getByWatertype(int watertypeId){
		try{
			return repo.getByWatertype(watertypeId);
		}
		catch(RepositoryException e){
			throw new ApiException("Cannot retrieve reference with watertype id "+watertypeId);
		}
	}
	
	/**
	 * Stores the reference
	 * @param reference the reference to be stored
	 * @return the reference after it's been stored
	 * @throws ApiException when there's a problem storing the reference
	 */
	public Reference save(Reference reference) throws ApiException{
		try {
			if(reference.getId()!=0)
				calcService.deleteByReference(reference.getId());
			repo.persist(reference);
			calcService.calculateReferenceValues(reference.getId());
			return reference;
		} catch(RepositoryException e){
			throw new ApiException("Cannot save reference");
		}
	}
	
	public boolean delete(int id) throws ApiException{
		try {
			calcService.deleteByReference(id);
			repo.remove(id);
			return true;
		} catch(RepositoryException e){
			throw new ApiException("Cannot delete reference");
		}
	}
}
