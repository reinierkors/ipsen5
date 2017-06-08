package users;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

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

        GsonBuilder gsonBuilder = new GsonBuilder();
        Gson gson = gsonBuilder.create();

		path("/user", ()->{
			get("",(req,res) -> new Gson().toJson(userService.getAll()));
			get("/",(req,res) -> new Gson().toJson(userService.getAll()));
			get("/:id",(req,res) -> new Gson().toJson(userService.get(Integer.parseInt(req.params("id")))));
            post("/add", (req, res) -> userService.create(new Gson().fromJson(req.body(), User.class)));
            post("/editpassword", (req, res) -> {
                PasswordModel passwords = gson.fromJson(req.body(),PasswordModel.class);
                return userService.editPassword(passwords.oldPassword, passwords.newPassword, passwords.confirmPassword, req.headers("X-Authorization"));
            });
		});

	}

	private class PasswordModel{
	    String oldPassword;
	    String newPassword;
	    String confirmPassword;
    }
}
