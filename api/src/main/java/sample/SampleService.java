package sample;

import api.ApiException;
import calculate.CalculateService;
import database.ConnectionManager;
import database.RepositoryException;
import location.Location;

import java.util.List;

/**
 * Service for samples
 *
 * @author Wander Groeneveld, Dylan de Wit
 * @version 0.3, 27-6-2017
 */
public class SampleService{
	private static final SampleService instance = new SampleService();
	private final SampleRepository repo;
	private final CalculateService calcService;
	
	private SampleService(){
		repo = new SampleRepository(ConnectionManager.getInstance().getConnection());
		calcService = CalculateService.getInstance();
	}
	
	public static SampleService getInstance(){
		return instance;
	}
	
	/**
	 * Retrieve sample with the specified by
	 *
	 * @param id the id of the sample to be retrieved
	 * @return a sample
	 * @throws ApiException when there's a problem retrieving the sample, or the sample does not exist
	 */
	public Sample get(int id) throws ApiException{
		try{
			Sample sample = repo.get(id);
			if(sample == null){
				throw new ApiException("Sample does not exist");
			}
			return sample;
		}
		catch(RepositoryException e){
			throw new ApiException("Cannot retrieve sample");
		}
	}
	
	/**
	 * Stores the sample
	 *
	 * @param sample the sample to be stored
	 * @return the sample after it's been stored
	 * @throws ApiException when there's a problem storing the sample
	 */
	public Sample save(Sample sample) throws ApiException{
		try{
			if(sample.getId() != 0)
				calcService.deleteBySample(sample.getId());
			repo.persist(sample);
			calcService.calculateSampleValues(sample.getId());
			calcService.calculateSampleQuality(sample);
			repo.persist(sample);
			return sample;
		}
		catch(RepositoryException e){
			throw new ApiException("Cannot save sample");
		}
	}
	
	/**
	 * Stores a list of samples
	 *
	 * @param samples a list of samples to be stored
	 * @return the list of samples after they've been stored
	 * @throws ApiException when there's a problem storing the samples
	 */
	public List<Sample> save(List<Sample> samples) throws ApiException{
		try{
			repo.persist(samples);
			samples.forEach(sample -> {
				calcService.calculateSampleValues(sample.getId());
				calcService.calculateSampleQuality(sample);
			});
			repo.persist(samples);
			return samples;
		}
		catch(RepositoryException e){
			throw new ApiException("Cannot save samples");
		}
	}
	
	public List<Sample> getByLocationId(int id) throws ApiException{
		return repo.getByLocationId(id);
	}
	
	public String getHighestDateById(Location location){
		return repo.getHighestDateById(location);
	}
	
	public List<String> getDistinctYears(){
		return repo.getDistinctYears();
	}
	
	public boolean delete(int id){
		calcService.deleteBySample(id);
		repo.remove(id);
		return true;
	}
	
	public List<Sample> getRecent(int count){
		return repo.getRecent(count);
	}
}
