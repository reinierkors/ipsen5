package wew;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import wew.value.WEWValue;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;
import static spark.Spark.get;
import static spark.Spark.path;
import static spark.Spark.post;

/**
 * Bevat de routes voor WEW-onderdelen van de api
 *
 * @author Wander Groeneveld
 * @version 0.3, 7-6-2017
 */
public class WEWRouter {
	public WEWRouter(){
		WEWService wewService = WEWService.getInstance();
		
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").create();
		gsonBuilder.registerTypeAdapter(WEWValue.class,new WEWValueJSON());
		Gson gson = gsonBuilder.create();
		
		path("/wew", ()->{
			get("/value/species/:ids", (req,res) -> {
				List<Integer> ids = stream(req.params("ids").split(",")).map(Integer::parseInt).collect(Collectors.toList());
				return gson.toJson(wewService.getBySpecies(ids));
			});
			get("/value", (req,res) -> gson.toJson(wewService.getAllValues()));
			get("/factor", (req,res) -> gson.toJson(wewService.getFactors()));
			
			post("/value", (req,res) -> {
				Type listType = new TypeToken<List<WEWValue>>(){}.getType();
				List<WEWValue> values = gson.fromJson(req.body(),listType);
				values = wewService.saveValues(values);
				return "{\"count\":"+values.size()+"}";
			});
			post("/factor", (req,res) -> {
				Type listType = new TypeToken<List<WEWService.WEWFactorWeb>>(){}.getType();
				List<WEWService.WEWFactorWeb> factors = gson.fromJson(req.body(),listType);
				return gson.toJson(wewService.saveFactors(factors));
			});
		});
		
	}
	
	//Custom WEWValue format for performance reasons
	private class WEWValueJSON implements JsonSerializer<WEWValue>, JsonDeserializer<WEWValue>{
		@Override
		public JsonElement serialize(WEWValue wewValue, Type type, JsonSerializationContext jsonSerializationContext) {
			JsonObject value = new JsonObject();
			value.addProperty("i",wewValue.getId());
			value.addProperty("c",wewValue.getFactorClassId());
			value.addProperty("s",wewValue.getSpeciesId());
			value.addProperty("v",wewValue.getValue());
			return value;
		}
		@Override
		public WEWValue deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
			WEWValue value = new WEWValue();
			JsonObject obj = jsonElement.getAsJsonObject();
			if(obj.has("i") && !obj.get("i").isJsonNull())
				value.setId(obj.get("i").getAsInt());
				value.setFactorClassId(obj.get("c").getAsInt());
				value.setSpeciesId(obj.get("s").getAsInt());
			if(obj.has("v") && !obj.get("v").isJsonNull())
				value.setValue(obj.get("v").getAsDouble());
			return value;
		}
	}
}
