import java.util.UUID;

public class TestModel {

    private UUID id = UUID.randomUUID();
    private String name = "hoi";
    private String gender = "DID YOU JUST ASSUME MY GENDER?";

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getGender() {
        return gender;
    }
}
