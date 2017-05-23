package api;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

import java.io.IOException;

/**
 * Turns ApiException into a json object to be sent to the client
 *
 * @author Wander Groeneveld
 * @version 0.1, 21-5-2017
 */
public class ApiExceptionTypeAdapter extends TypeAdapter<ApiException> {
	
	@Override
	public void write(JsonWriter jsonWriter, ApiException e) throws IOException {
		jsonWriter.beginObject().name("error").value(e.getMessage()).endObject().close();
	}
	
	@Override
	public ApiException read(JsonReader jsonReader) throws IOException {
		return null;
	}
}
