package sample;

import static spark.Spark.path;
import static spark.Spark.get;

/**
 * Bevat de routes voor sample-onderdelen van de api
 * @author Wander Groeneveld
 * @version 0.1, 18-5-2017
 */
public class SampleRouter {
	public SampleRouter(){
		path("/sample", ()->{
			get("/test",(req,res)-> "Welkom op 127.0.0.1:8080/api/sample/test");
			//..etc
		});
		
	}
}
