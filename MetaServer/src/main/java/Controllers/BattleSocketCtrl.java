package Controllers;

import Models.Battle;
import Models.Card;
import Models.User;
import Utilities.JsonUtil;
import Utilities.WebSocketMessage;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.mongodb.util.JSON;
import org.bson.types.ObjectId;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.mongodb.morphia.query.Query;

import java.util.List;
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
        try{
            user.getRemote().sendString(toJson(new WebSocketMessage("connected", "Wow, thanks for connecting, that's so nice")));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason){
        System.out.println("Connection closed.");
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message){

        try{
            //This converts the whole message to a map.
            Map<String,String> messageAsMap = JsonUtil.parseToMap(message);

            /*
            The whole map should have the form
            {
                battle_id: battle id received during matchmaking
                username: username
                user_cards: user cards selected for this battle
            }
            */

            String username = messageAsMap.get("username");
            ObjectId battle_id = new ObjectId(messageAsMap.get("battle_id"));
            List<Card> user_cards = JsonUtil.parseToListOfCards(messageAsMap.get("user_cards"));

            BattleCtrl.updateReadiness(battle_id, username, user_cards);

            if (checkReadiness(battle_id)){
                System.out.println("Sending battle to sim server.");
                String battle_results = BattleCtrl.postToSimServer(battle_id);
            }

            // Send battle results back to UI


        }catch(Exception e){
            System.out.println(e);
        }
    }

    public boolean checkReadiness(ObjectId battle_id){
        return BattleCtrl.readyToStart(battle_id);
    }

}
