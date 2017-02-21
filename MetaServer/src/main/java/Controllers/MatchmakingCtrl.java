package Controllers;

import Models.User;
import Utilities.JsonUtil;
import Utilities.ResponseError;
import Utilities.ResponseSuccess;
import Utilities.WebSocketMessage;
import org.bson.types.ObjectId;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.mongodb.morphia.query.Query;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static Utilities.DBConn.datastore;
import static Utilities.JsonUtil.toJson;

/**
 * Created by Erik Tillberg on 2/21/2017.
 */
@WebSocket
public class MatchmakingCtrl {

    //Map shared between threads so it needs to be a concurrent map.
    private static Map<User, Session> userMatchmakingMap = new ConcurrentHashMap<>();

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
            try{
            user.getRemote().sendString("{\"message\":\"Wow thanks for connecting, that's really nice.\"}");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnWebSocketClose
    public void onClose(Session userSession, int statusCode, String reason){
        System.out.println("Closing connection");

        User user = null;
        for (Map.Entry<User, Session> entry : userMatchmakingMap.entrySet()){
            if (entry.getValue().equals(userSession)){
                user = entry.getKey();
                break;
            }
        }

        if (user == null){
            System.out.println("Couldn't find the user even though they have to be there.");
            return;
        }

        //Remove the user from the matchmaking list because you shouldn't match make with someone who is no longer there.
        userMatchmakingMap.remove(user);

    }

    @OnWebSocketMessage
    public void onMessage(Session userSession, String message){
        try{
            //This converts the whole message to a map.
            Map<String,String> messageAsMap = JsonUtil.parseToMap(message);

            /*
            The whole map should have the form
            {
                type: start || cancel
                id: someUserId
                session: someToken
            }
            */

            String messageType = messageAsMap.get("type");
            if (messageType == null) {userSession.getRemote().sendString(toJson(new WebSocketMessage("error", "Invalid message")));
                userSession.close(400, "couldn't find user");
                return;
            }

            String id = messageAsMap.get("id");

            String sessionToken = messageAsMap.get("sessionToken");

            ObjectId oi = new ObjectId(id);

            final Query<User> query = datastore.createQuery(User.class)
                    .field("id").equal(oi);

            User user;
            try {
                user = query.get();
            } catch (Exception e){
                e.printStackTrace();
                userSession.close(400, "Could not find user");
                return;
            }

            if (user == null){
                userSession.close(400, "Could not find user");
                return;
            }

            if (userMatchmakingMap.get(user) == null){
                userMatchmakingMap.put(user, userSession);
            } else {
                System.out.println("User already in the user map");
                userSession.getRemote().sendString(toJson(new WebSocketMessage("error", "user already matchmaking")));
                return;
            }

            System.out.println("PRINTING EVERYONE IN THE USER MAP");

            for(Map.Entry<User, Session> entry: userMatchmakingMap.entrySet()){
                System.out.println(entry.getKey().getUsername());
            }

            userSession.getRemote().sendString(toJson(new WebSocketMessage("success", "matchmaking started")));

        } catch (Exception e) {
            e.printStackTrace();
            try{
                userSession.getRemote().sendString("Error in message");
            } catch (Exception e2){
                e2.printStackTrace();
                userSession.close(400, "Something went horribly wrong");
            }
        }

    }

}
