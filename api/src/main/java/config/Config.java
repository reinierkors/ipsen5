package config;

import java.nio.file.Files;
import java.nio.file.Paths;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.InstanceCreator;

/**
 * Holds and reads the configuration for this application
 * Reads defaultConfig.json and devConfig.json
 * Any properties in devConfig.json will take priority over the ones in defaultConfig.json
 * @author Wander Groeneveld
 * @version 0.1, 18-5-2017
 */
public class Config {
	private static Config instance;
	
	public Api api;
	//TODO default config should be included in the .jar
	private static final String DEFAULT_FILENAME = "defaultConfig.json";
	//TODO dev config should be looked for in the folder where the .jar is
	private static final String DEV_FILENAME = "devConfig.json";
	
	public Config(){
	}
	
	public static Config getInstance(){
		if(instance==null){
			try {
				//Load the default config
				String defaultJson = new String(Files.readAllBytes(Paths.get(DEFAULT_FILENAME)));
				Gson defaultGson = new Gson();
				Config defaultConfig = defaultGson.fromJson(defaultJson,Config.class);
				instance = defaultConfig;
				
				//Load the dev config and override properties in the instance
				String devJson = new String(Files.readAllBytes(Paths.get(DEV_FILENAME)));
				GsonBuilder devGsonBuilder = new GsonBuilder();
				devGsonBuilder.registerTypeAdapter(Config.class, (InstanceCreator<Config>) type -> instance);
				devGsonBuilder.registerTypeAdapter(Api.class, (InstanceCreator<Config.Api>) type -> instance.api);
				devGsonBuilder.registerTypeAdapter(Api.Database.class, (InstanceCreator<Config.Api.Database>) type -> instance.api.database);
				Gson devGson = devGsonBuilder.create();
				Config devConfig = devGson.fromJson(devJson, Config.class);
				instance = devConfig;
			}
			catch(java.io.IOException ex){
				System.out.println(ex);
			}
		}
		return instance;
	}
	
	public class Api{
		public String host;
		public int port;
		public Database database;
		
		public class Database {
			public String username;
			public String password;
			public String host;
			public int port;
			public String database;
			public String driver;
		}
	}
}
