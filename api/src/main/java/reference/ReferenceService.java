package reference;

import api.ApiException;
import calculate.CalculateService;
import database.ConnectionManager;
import database.RepositoryException;
import location.Location;
import location.LocationRepository;
import sample.Sample;
import sample.SampleRepository;

import java.util.List;

/**
 * Service for references
 *
 * @author Wander Groeneveld
 * @version 0.1, 19-6-2017
 */
public class ReferenceService{
	private static ReferenceService instance;
	private final ReferenceRepository repo;
	private final CalculateService calcService;
	private final LocationRepository locationRepo;
	private final SampleRepository sampleRepo;
	
	private ReferenceService(){
		repo = new ReferenceRepository(ConnectionManager.getInstance().getConnection());
		calcService = CalculateService.getInstance();
		locationRepo = new LocationRepository(ConnectionManager.getInstance().getConnection());
		sampleRepo = new SampleRepository(ConnectionManager.getInstance().getConnection());
	}
	
	public static ReferenceService getInstance(){
		if(instance == null)
			instance = new ReferenceService();
		return instance;
	}
	
	/**
	 * Retrieve reference with the specified by
	 *
	 * @param id the id of the reference to be retrieved
	 * @return a reference
	 * @throws ApiException when there's a problem retrieving the reference, or the reference does not exist
	 */
	public Reference get(int id) throws ApiException{
		try{
			return repo.get(id);
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve reference");
		}
	}
	
	/**
	 * Retrieves a list of all references
	 *
	 * @return a list of all references
	 * @throws ApiException when there was a problem retrieving the references
	 */
	public List<Reference> getAll() throws ApiException{
		try{
			return repo.getAll();
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve references");
		}
	}
	
	public Reference getByWatertype(int watertypeId){
		try{
			return repo.getByWatertype(watertypeId);
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve reference with watertype id " + watertypeId);
		}
	}
	
	/**
	 * Stores the reference
	 *
	 * @param reference the reference to be stored
	 * @return the reference after it's been stored
	 * @throws ApiException when there's a problem storing the reference
	 */
	public Reference save(Reference reference) throws ApiException{
		try{
			if(reference.getId() != 0){
				calcService.deleteByReference(reference.getId());
			}
			
			repo.persist(reference);
			
			if(reference.getTaxonIds().size()>0){
				calcService.calculateReferenceValues(reference.getId());
				
				int watertypeId = reference.getWatertypeId();
				List<Location> locations = locationRepo.getByFilters(watertypeId, 0, "");
				
				locations.forEach(location -> {
					List<Sample> samples = sampleRepo.getByLocationId(location.getId());
					
					samples.forEach(sample -> {
						calcService.deleteBySample(sample.getId());
						calcService.calculateSampleValues(sample.getId());
						double quality = calcService.calculateSampleQuality(sample.getId(), reference.getId());
						sample.setQuality(quality);
						sampleRepo.persist(sample);
					});
				});
			}
			
			return reference;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not save reference");
		}
	}
	
	public boolean delete(int id) throws ApiException{
		try{
			calcService.deleteByReference(id);
			repo.remove(id);
			return true;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not delete reference");
		}
	}
}
