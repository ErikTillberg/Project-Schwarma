package Utilities;

import Annotations.Exclude;
import Models.Equipment;
import com.google.gson.*;
import spark.ResponseTransformer;
import org.bson.types.ObjectId;

import java.lang.reflect.Type;
import java.util.Map;

/**
 * Created by Erik_Tillberg on 2/3/2017.
 */
public class JsonUtil {
    /**
     *
     * @param object Some object with member variables
     * @return Returns the above object in json format using google's GSON
     */
    public static String toJson(Object object){
        return getGson().toJson(object);
    }

    public static Gson getGson(){
        return gsonBuilder.create();
    }

    /**
     *
     * @return a function that does a transformation of a java object to json form
     */
    public static ResponseTransformer regularJson(){
        return JsonUtil::toJson;
    }

    /**
     * This is magic that stops GSON from serializing 'ObjectId' to it's base components
     * (which are built out of unix timestamp, process id, and more) -> just returns the hex string version instead.
     * Taken from http://stackoverflow.com/questions/35487023/bson-objectid-serialization-with-gson
     */
    private static final GsonBuilder gsonBuilder = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ")
            .registerTypeAdapter(ObjectId.class, new JsonSerializer<ObjectId>(){
                @Override
                public JsonElement serialize(ObjectId src, Type typeOfSrc, JsonSerializationContext context){
                    return new JsonPrimitive(src.toHexString());
                }
            })
            .registerTypeAdapter(ObjectId.class, new JsonDeserializer<ObjectId>() {
                @Override
                public ObjectId deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
                    return new ObjectId(jsonElement.getAsString());
                }
            })
            .setExclusionStrategies(new JsonUtil.AnnotationExclusionStrategy());


    /**
     * Exclusion strategy for GSON so that it excludes anything with the annotation '@Exclude' attached to it.
     * This is specifically a solution to not being able to use the 'transient' keyword because then the data
     * won't be saved in the database.
     *
     * This allows us to exclude things like passwords and salts from being returned by GSON, but will allow them to be saved.
     *
     * I took this solution from http://stackoverflow.com/questions/4802887/gson-how-to-exclude-specific-fields-from-serialization-without-annotations
     */
    public static class AnnotationExclusionStrategy implements ExclusionStrategy {
        @Override
        public boolean shouldSkipField(FieldAttributes fieldAttributes) {
            return fieldAttributes.getAnnotation(Exclude.class) != null;
        }

        @Override
        public boolean shouldSkipClass(Class<?> aClass) {
            return false;
        }
    }

    public static Map<String, String> parseToMap(String object){
        return new Gson().fromJson(object, Map.class);
    }

    public static Equipment parseToEquipment(String object) { return new Gson().fromJson(object, Equipment.class);}

}
