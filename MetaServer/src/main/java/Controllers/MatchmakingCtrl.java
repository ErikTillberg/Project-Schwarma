package Controllers;

import Models.User;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import java.util.ArrayList;

/**
 * Created by Erik Tillberg on 2/21/2017.
 */
@WebSocket
public class MatchmakingCtrl {

    private static ArrayList<User> userMatchmakingList = new ArrayList<>();

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
        try{
            user.getRemote().sendString("Wow thanks for connecting, that's really nice.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason){
        //Do stuff
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message){
        try{
            System.out.println(message);
            user.getRemote().sendString("Wow thanks for the message, really appreciated.");
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


}
