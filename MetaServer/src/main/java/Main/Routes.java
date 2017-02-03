package Main; /**
 * Created by Erik Tillberg on 1/26/2017.
 */

import Controllers.AuthenticationCtrl;
import Models.User;
import Utilities.ResponseError;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;

import static Utilities.DBConn.datastore;
import static Utilities.JsonUtil.regularJson;
import static spark.Spark.*;

public class Routes {

    public static void main(String[] args) {
        port(9000);

        post("/login", (req, res) -> {
           return AuthenticationCtrl.login("test@test.com", "password");
        });

        post("/signup", (req, res) -> {

            res.type("application/json"); //set the response type (i think this is just good practice)

            String username = req.queryParams("username");
            String email = req.queryParams("email");
            String password = req.queryParams("password");

            Object response = AuthenticationCtrl.signup(email, username, password);
            if (response instanceof ResponseError){
                res.status(400); //we have to explicitly set the response as failure, this is the way I thought to do it, there is likely a better way.
                return response;
            }

            return response;

        }, regularJson());

        before((request, response) -> {

            //runs before any routes are called
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
