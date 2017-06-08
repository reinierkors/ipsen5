package calculate;

import api.ApiException;
import database.ConnectionManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * Service with methods regarding calculating sample values (using the WEW list)
 *
 * @author Wander Groeneveld
 * @version 0.1, 9-6-2017
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
	
	public CalculateService(){
		this.connection = ConnectionManager.getInstance().getConnection();
	}
	public static CalculateService getInstance() {
		return instance;
	}
	
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
}
