package sample;

import static spark.Spark.path;
import static spark.Spark.get;
import com.google.gson.Gson;

/**
 * Bevat de routes voor sample-onderdelen van de api
 * @author Wander Groeneveld
 * @version 0.1, 18-5-2017
 */
public class SampleRouter {
	public SampleRouter(){
		Gson gson = new Gson();
		
		path("/sample", ()->{
			get("/test",(req,res)-> gson.toJson("Welkom op 127.0.0.1:8080/api/sample/test"));
			//..etc
		});
		
	}
}
