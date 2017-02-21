package Controllers;

import Models.User;
import Utilities.JsonUtil;
import Utilities.ResponseError;
import Utilities.ResponseSuccess;
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

/**
 * Created by Erik Tillberg on 2/21/2017.
 */
@WebSocket
public class MatchmakingCtrl {

    //Map shared between threads so it needs to be a concurrent map.
    private static Map<Session, User> userMatchmakingMap = new ConcurrentHashMap<>();

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
            try{
            user.getRemote().sendString("{message:\"Wow thanks for connecting, that's really nice.\"}");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnWebSocketClose
    public void onClose(Session userSession, int statusCode, String reason){
        try{
            userSession.getRemote().sendString("{message: Closing connection");

            userMatchmakingMap.remove(userSession);

        } catch (Exception e){
            e.printStackTrace();
        }
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
            if (messageType == null) {userSession.getRemote().sendString("{message:no, bad}"); userSession.close(); return;}

            String id = messageAsMap.get("id");

            String sessionToken = messageAsMap.get("session");

            System.out.println(messageType + id + sessionToken);

            final Query<User> query = datastore.createQuery(User.class)
                    .field("id").equal(id);

            User user;
            try {
                user = query.get();
            } catch (Exception e){
                e.printStackTrace();
                userSession.getRemote().sendString("{message:no, bad}"); userSession.close(); return;
            }

            userMatchmakingMap.put(userSession, user);

            System.out.println("PRINTING EVERYONE IN THE USER MAP");


            userSession.getRemote().sendString("{message: Matchmaking started}");
        } catch (Exception e) {
            e.printStackTrace();
            userSession.close();
        }

    }


}
