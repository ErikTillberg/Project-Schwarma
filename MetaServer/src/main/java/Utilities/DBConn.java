package Utilities;

import com.mongodb.MongoClient;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;

/**
 * Created by crese_000 on 2/1/2017.
 */
public class DBConn {
    //magic class for ORM
    static final Morphia morphia = new Morphia();

    //datastore connects to the default port (obviously have mongod running in background)
    //It uses the database named "Schwarma" (creates one if it doesn't exist)
    //Collections are created bsaed on the Models we define.
    public static final Datastore datastore = morphia.createDatastore(new MongoClient(), "Schwarma");

}
