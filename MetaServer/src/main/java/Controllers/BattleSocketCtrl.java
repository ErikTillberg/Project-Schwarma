package Controllers;

import Models.User;
import Utilities.JsonUtil;
import Utilities.WebSocketMessage;
import org.bson.types.ObjectId;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.mongodb.morphia.query.Query;

import java.util.Map;

import static Utilities.DBConn.datastore;
import static Utilities.JsonUtil.toJson;

/**
 * Created by Erik Tillberg on 3/8/2017.
 */
@WebSocket
public class BattleSocketCtrl {

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {

    }

    @OnWebSocketClose
    public void onClose(Session userSession, int statusCode, String reason){

    }

    @OnWebSocketMessage
    public void onMessage(Session userSession, String message){

    }


}
