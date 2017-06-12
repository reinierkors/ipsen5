package calculate;

import api.ApiException;
import database.ConnectionManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Service with methods regarding calculating sample values (using the WEW list)
 *
 * @author Wander Groeneveld
 * @version 0.2, 9-6-2017
 */
public class CalculateService {
	private Connection connection;
	private static final CalculateService instance = new CalculateService();
	private String queryCalcSample = "INSERT INTO `sample_wew_factor_class`(`sample_id`,`factor_class_id`,`computed_value`) "+
		"SELECT `sample_id`,`factor_class_id`,AVG(`wew_value`.`value`) "+
		"FROM `sample_species` "+
		"INNER JOIN `wew_value` "+
		"ON `wew_value`.`species_id` = `sample_species`.`species_id` "+
		"WHERE `sample_id` = ? "+
		"GROUP BY `factor_class_id`, `sample_id` ";
	private String queryGetBySample = "SELECT `factor_class_id`,`computed_value` FROM `sample_wew_factor_class` WHERE `sample_id` = ?";
	
	public CalculateService(){
		this.connection = ConnectionManager.getInstance().getConnection();
	}
	
	public static CalculateService getInstance() {
		return instance;
	}
	
	/**
	 * Runs a query on the server that calculates and stores water quality properties
	 * @param sampleId the id of the sample object to calculate the properties of
	 */
	public void calculateSampleValues(int sampleId){
		try {
			PreparedStatement psCalcSample = this.connection.prepareStatement(queryCalcSample);
			psCalcSample.setInt(1,sampleId);
			psCalcSample.executeUpdate();
		}
		catch(SQLException e){
			e.printStackTrace();
			throw new ApiException("Problem running the calculation query");
		}
	}
	
	/**
	 * Retrieves calculated water quality properties of a single sample
	 * @param sampleId the id of a sample
	 * @return a list containing water quality properties
	 */
	public List<CalculationData> getBySample(int sampleId){
		try {
			PreparedStatement psGetBySample = this.connection.prepareStatement(queryGetBySample);
			psGetBySample.setInt(1,sampleId);
			ResultSet resultSet = psGetBySample.executeQuery();
			
			List<CalculationData> list = new ArrayList<>();
			if(resultSet==null)
				return list;
			
			while(resultSet.next()){
				list.add(new CalculationData(resultSet.getInt("factor_class_id"),resultSet.getDouble("computed_value")));
			}
			
			return list;
		}
		catch(SQLException e){
			e.printStackTrace();
			throw new ApiException("Could not retrieve sample calculations");
		}
	}
	
	/**
	 * A samples pair of factor class and calculated value
	 * The value is the average of all species in the WEW list for a given factor class
	 */
	public class CalculationData{
		public int factorClassId;
		public double computedValue;
		
		public CalculationData(int factorClassId, double computedValue) {
			this.factorClassId = factorClassId;
			this.computedValue = computedValue;
		}
	}
}
