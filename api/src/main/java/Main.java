//import static spark.Spark.get;
import static spark.Spark.port;
import config.Config;

public class Main {
	public static void main(String[] args) {
		port(Config.getInstance().api.port);
		
		
	}
}
