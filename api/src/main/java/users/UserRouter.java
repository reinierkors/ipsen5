package users;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

import static spark.Spark.*;

/**
 * Routes for the user parts of the API
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
			get("",(req,res) -> gson.toJson(userService.getAll()));
			get("/",(req,res) -> gson.toJson(userService.getAll()));
            get("/currentuser",(req, res) -> gson.toJson(userService.getCurrentUser(req.headers("X-Authorization"))));
			get("/:id",(req,res) -> gson.toJson(userService.get(Integer.parseInt(req.params("id")))));
            post("/admin/add", (req, res) -> userService.create(gson.fromJson(req.body(), User.class)));
            post("/admin/editpassword", (req, res) -> {
                PasswordModel passwords = gson.fromJson(req.body(),PasswordModel.class);
                return userService.editPassword(passwords.oldPassword, passwords.newPassword, passwords.confirmPassword, req.headers("X-Authorization"));
            });
            post("/edit", (req, res) -> gson.toJson(userService.editUser(gson.fromJson(req.body(), User.class))));
		});

	}

	private class PasswordModel{
	    String oldPassword;
	    String newPassword;
	    String confirmPassword;
    }
}
