package Utilities; /**
 * Created by Erik Tillberg on 1/26/2017.
 */

import Controllers.AuthenticationCtrl;
import Models.User;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;

import static Utilities.DBConn.datastore;
import static spark.Spark.*;

public class Routes {

    public static void main(String[] args) {
        port(9000);

        get("/login", (req, res) -> {
           return "loggin in...";
        });

        get("/signup", (req, res) -> {

            //signin with the Authentication Controller (which does nothing of the sort at the moment)

            return AuthenticationCtrl.signup("test@test.com", "porkypig", "password");

        });
        before((request, response) -> { //runs before any routes are called
            //My idea here is that we check for a session token that is generated on login
            //with the user that the token should have been generated in
            //e.g. login -> token generated, stored in session and db -> every REST call, check if session.token == db.user.token
            boolean authenticated;
            authenticated = true; //no authentication right now
            if (!authenticated){
                halt(401, "You are not welcome here");
            }
        });
    }

}
