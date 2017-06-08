package sample;

import api.ApiException;
import calculate.CalculateService;
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
	private final CalculateService calcService;
	
	private SampleService() {
		repo = new SampleRepository(ConnectionManager.getInstance().getConnection());
		calcService = CalculateService.getInstance();
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
			calcService.calculateSampleValues(sample.getId());
			return sample;
		} catch(RepositoryException e){
			throw new ApiException("Cannot save sample");
		}
	}
	
	public List<Sample> save(List<Sample> samples) throws ApiException{
		try {
			repo.persist(samples);
			samples.forEach(sample -> calcService.calculateSampleValues(sample.getId()));
			return samples;
		} catch(RepositoryException e){
			throw new ApiException("Cannot save samples");
		}
	}
}
