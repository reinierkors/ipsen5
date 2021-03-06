package authenticate;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import users.User;
import users.UserService;

import static spark.Spark.*;

/**
 * A router for authentication features such as logging in and out
 * @author Marijn Kroon
 */
public class AuthRouter {
    public AuthRouter(){
        UserService userService = UserService.getInstance();

        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
        Gson gson = gsonBuilder.create();

        post("/authenticate/login",(request,response) -> gson.toJson(userService.createSessionToken(gson.fromJson(request.body(), User.class))));

        post("/authenticate/logout", (request, response) -> userService.logout(request.headers("X-Authorization")));
    }
}
