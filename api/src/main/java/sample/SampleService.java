package sample;

import api.ApiException;
import calculate.CalculateService;
import database.ConnectionManager;
import database.RepositoryException;
import location.Location;
import location.LocationRepository;
import reference.Reference;
import reference.ReferenceRepository;
import watertype.WatertypeRepository;

import java.util.List;

/**
 * Service for samples
 *
 * @author Wander Groeneveld, Dylan de Wit
 * @version 0.3, 27-6-2017
 */
public class SampleService{
	private static SampleService instance;
	private final SampleRepository repo;
	private final CalculateService calcService;
	private final LocationRepository locationRepo;
	private final ReferenceRepository refRepo;
	
	private SampleService(){
		repo = new SampleRepository(ConnectionManager.getInstance().getConnection());
		calcService = CalculateService.getInstance();
		locationRepo = new LocationRepository(ConnectionManager.getInstance().getConnection());
		refRepo = new ReferenceRepository(ConnectionManager.getInstance().getConnection());
	}
	
	public static SampleService getInstance(){
		if(instance == null)
			instance = new SampleService();
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
			return repo.get(id);
		}
		catch(RepositoryException e){
			throw new ApiException("Could not retrieve sample");
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
			if(sample.getId() != 0){
				calcService.deleteBySample(sample.getId());
			}
			
			repo.persist(sample);
			
			calcService.calculateSampleValues(sample.getId());
			
			int watertypeId = locationRepo.get(sample.getLocationId()).getWatertypeKrwId();
			Reference reference = refRepo.getByWatertype(watertypeId);
			
			if(reference == null)
				return sample;
			
			double quality = calcService.calculateSampleQuality(sample.getId(),reference.getId());
			sample.setQuality(quality);
			
			repo.persist(sample);
			return sample;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not save sample");
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
			samples.forEach(sample -> {
				if(sample.getId() != 0)
					calcService.deleteBySample(sample.getId());
			});
			
			repo.persist(samples);
			
			samples.forEach(sample -> {
				calcService.calculateSampleValues(sample.getId());
				try{
					int watertypeId = locationRepo.get(sample.getLocationId()).getWatertypeKrwId();
					Reference reference = refRepo.getByWatertype(watertypeId);
					if(reference == null)
						return;
					
					double quality = calcService.calculateSampleQuality(sample.getId(),reference.getId());
					sample.setQuality(quality);
				}
				catch(RepositoryException e){}
			});
			return samples;
		}
		catch(RepositoryException e){
			throw new ApiException("Could not save samples");
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
