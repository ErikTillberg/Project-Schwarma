package Utilities;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoDatabase;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;

/**
 * Created by Erik_Tillberg on 2/1/2017.
 */
public class DBConn {
    //magic class for ORM
    static final Morphia morphia = new Morphia();

    //datastore connects to the default port (obviously have mongod running in background)
    //It uses the database named "Schwarma" (creates one if it doesn't exist)
    //Collections are created bsaed on the Models we define.

    static MongoClientURI uri  = new MongoClientURI("mongodb://schwarma_client:client@ds151279.mlab.com:51279/?authSource=heroku_45dzn51n");
    public static final Datastore datastore = morphia.createDatastore(new MongoClient(uri), "heroku_45dzn51n");

}
