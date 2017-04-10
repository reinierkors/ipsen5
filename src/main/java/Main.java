import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        port(8080);
//        ipAddress("");
        staticFileLocation("/public");

        new TestResource(new TestService());
    }
}