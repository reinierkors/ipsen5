package users;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static spark.Spark.*;

/**
 * Bevat de routes voor user-onderdelen van de api
 *
 * @author Reinier Kors
 * @version 0.1, 30-5-2017
 */
public class UserRouter {
	public UserRouter(){
		UserService userService = UserService.getInstance();

		path("/user", ()->{
			get("",(req,res) -> new Gson().toJson(userService.getAll()));
			get("/",(req,res) -> new Gson().toJson(userService.getAll()));
			get("/:id",(req,res) -> new Gson().toJson(userService.get(Integer.parseInt(req.params("id")))));
            post("/add", (req, res) -> userService.create(new Gson().fromJson(req.body(), User.class)));
		});
	}
}
