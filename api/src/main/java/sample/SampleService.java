package sample;

import api.ApiException;
import database.ConnectionManager;
import database.RepositoryException;

import java.util.List;

/**
 * Service voor sample-gerelateerde business logic
 * Staat tussen de router en de repository
 *
 * @author Wander Groeneveld
 * @version 0.2, 4-6-2017
 */
public class SampleService {
	private static final SampleService instance = new SampleService();
	private final SampleRepository repo;
	
	private SampleService() {
		repo = new SampleRepository(ConnectionManager.getInstance().getConnection());
		
	}
	
	public static SampleService getInstance() {
		return instance;
	}
	
	public Sample get(int id) throws ApiException {
		try {
			Sample sample = repo.get(id);
			if(sample==null) {
				throw new ApiException("Sample does not exist");
			}
			return sample;
		} catch(RepositoryException e){
			throw new ApiException("Cannot retrieve sample");
		}
	}
	
	public Sample save(Sample sample) throws ApiException{
		try {
			repo.persist(sample);
			return sample;
		} catch(RepositoryException e){
			throw new ApiException("Cannot save sample");
		}
	}
	
	public List<Sample> save(List<Sample> samples) throws ApiException{
		try {
			repo.persist(samples);
			return samples;
		} catch(RepositoryException e){
			throw new ApiException("Cannot save samples");
		}
	}

	public List<Sample> getByLocationId(int id) throws ApiException{
		return repo.getByLocationId(id);

	}
}
