/**
 * Created by Erik Tillberg on 1/26/2017.
 */

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;
import spark.Request;
import spark.Response;

import static spark.Spark.*;

public class test {
    //magic class for ORM
    static final Morphia morphia = new Morphia();

    //datastore connects to the default port (obviously have mongod running in background)
    static final Datastore datastore = morphia.createDatastore(new MongoClient(), "test");

    public static void main(String[] args) {
        port(9000);
        get("/hello", (req, res) -> {

            MongoClient mongoClient = new MongoClient("localhost", 27017);

            DB db = mongoClient.getDB("test"); //screw you deprecation
            System.out.println("Connected to database successfully");

            DBCollection coll = db.getCollection("prettyNeatCollection");
            System.out.println("Collection created successfully");

            //let's save something to the database:

            final Employee billy = new Employee("Billy Joel", 103040234.34); //This guy's rich.
            try{
                datastore.save(billy);
            } catch (Exception e){
                e.printStackTrace();
            }


            return "You created a collection in db test if this worked";

        });
        before((request, response) -> { //runs before any routes are called
            boolean authenticated;
            authenticated = true; //always authenticated as test
            if (!authenticated){
                halt(401, "You are not welcome here");
            }
        });
    }

}
