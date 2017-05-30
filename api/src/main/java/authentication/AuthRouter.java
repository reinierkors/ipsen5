package authentication;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static spark.Spark.get;
import static spark.Spark.post;


/**
 * Bevat de routes voor de authenticatie van de applicatie
 *
 * @author Marijn Kroon
 * @version 0.1, 29-5-2017
 */
public class AuthRouter {

	public AuthRouter(){
		AuthService authService = AuthService.getInstance();

		GsonBuilder gsonBuilder = new GsonBuilder();
		Gson gson = gsonBuilder.create();

        post("/authenticate",(request,response) -> gson.toJson(authService.createSessionToken(gson.fromJson(request.body(), User.class))));
		
	}
}
