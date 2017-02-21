package Main; /**
 * Created by Erik Tillberg on 1/26/2017.
 */

import Controllers.AuthenticationCtrl;
import Controllers.InventoryCtrl;
import Controllers.MatchmakingCtrl;
import Models.Card;
import Models.Equipment;
import Models.User;
import Utilities.ResponseError;
import com.google.gson.Gson;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;
import spark.ResponseTransformer;

import static Utilities.DBConn.datastore;
import static Utilities.JsonUtil.regularJson;
import static spark.Spark.*;

public class Routes {

    public static void main(String[] args) {
        port(9000);

        webSocket("/matchmaking", MatchmakingCtrl.class);

        enableCORS("*", "*", "*");
//some tests for cards
//        for (int i = 0; i<10; i++){
//            System.out.println(Card.GenerateCard(1500, "attack"));
//        }

        post("/login", (req, res) -> {

            String username = req.queryParams("username");
            String password = req.queryParams("password");

            Object response = AuthenticationCtrl.login(username, password);

            if (response instanceof ResponseError) {
                res.status(400);
                return response;
            }

            return response;

        }, regularJson());


        post("/signup", (req, res) -> {

            res.type("application/json"); //set the response type (i think this is just good practice)

            String username = req.queryParams("username");
            String email = req.queryParams("email");
            String password = req.queryParams("password");
            String characterType = req.queryParams("characterType");

            Object response = AuthenticationCtrl.signup(email, username, password, characterType);
            if (response instanceof ResponseError){
                res.status(400); //we have to explicitly set the response as failure, this is the way I thought to do it, there is likely a better way.
                return response;
            }

            return response;

        }, regularJson());


        post("/listInventory", (req, res) -> {

            res.type("application/json"); //set the response type (i think this is just good practice)

            String username = req.queryParams("username");

            Object response = InventoryCtrl.listInventory(username);
            if (response instanceof ResponseError){
                res.status(400); //we have to explicitly set the response as failure, this is the way I thought to do it, there is likely a better way.
                return response;
            }

            return response;

        }, regularJson());


        post("/deleteCard", (req, res) -> {

            res.type("application/json"); //set the response type (i think this is just good practice)

            String username = req.queryParams("username");
            String body = req.body();
            System.out.println(body);
            Card aCard = new Gson().fromJson(body, Card.class);

            Object response = InventoryCtrl.deleteCard(username, aCard);
            if (response instanceof ResponseError){
                res.status(400); //we have to explicitly set the response as failure, this is the way I thought to do it, there is likely a better way.
                return response;
            }

            return response;

        }, regularJson());


        post("/deleteEquipment", (req, res) -> {

            res.type("application/json"); //set the response type (i think this is just good practice)

            String username = req.queryParams("username");
            String body = req.body();
            Equipment aGear = new Gson().fromJson(body, Equipment.class);

            Object response = InventoryCtrl.deleteEquipment(username, aGear);
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



    private static void enableCORS(final String origin, final String methods, final String headers) {
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }
            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }
            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", origin);
            response.header("Access-Control-Request-Method", methods);
            response.header("Access-Control-Allow-Headers", headers);
            // Note: this may or may not be necessary in your particular application
            response.type("application/json");
        });
    }
}

