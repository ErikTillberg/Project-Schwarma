package Controllers;

import Models.Battle;
import Models.Card;
import Models.Equipment;
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
import java.util.concurrent.ConcurrentHashMap;

import static Utilities.DBConn.datastore;
import static Utilities.JsonUtil.toJson;
import static Utilities.JsonUtil.toJsonNoEscapes;

/**
 * Created by Erik Tillberg on 3/8/2017.
 */
@WebSocket
public class BattleSocketCtrl {

    public static Map<String, Session> activeUsers = new ConcurrentHashMap<>();

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

        String username = null;
        for (Map.Entry<String, Session> entry : activeUsers.entrySet()){
            if (entry.getValue().equals(user)){
                username = entry.getKey();
                break;
            }
        }

        //Couldn't find the user.
        if (username == null){
            return;
        } else {
            //Remove the user from the list
            activeUsers.remove(username);
        }
        
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
                att_attribute: player attack rng
                def_attribute: player defense rng
                mov_attribute: player mobility rng
                user_cards: user cards selected for this battle
            }
            */

            String username = messageAsMap.get("username");
            String battle_id = messageAsMap.get("battle_id");
            String att_attribute = messageAsMap.get("att_attribute");
            String def_attribute = messageAsMap.get("def_attribute");
            String mov_attribute = messageAsMap.get("mov_attribute");

            String type = messageAsMap.get("type");
            if (type != null){return;}

            List<Card> user_cards = JsonUtil.parseToListOfCards(messageAsMap.get("user_cards"));

            activeUsers.put(username, user);

            BattleCtrl.updateReadiness(battle_id, username, att_attribute, def_attribute, mov_attribute, user_cards);
            String battle_results;

            if (checkReadiness(battle_id)){
                System.out.println("Sending battle to sim server.");
                battle_results = BattleCtrl.postToSimServer(battle_id);
                System.out.println("------------- BATTLE RESULTS -------------");
                System.out.println(battle_results);

                //Send the data to both 'user' (the one who sent this message)
                // and the other person they matched with

                String otherUser = BattleCtrl.getOtherUser(battle_id, username);

                Session otherSession = activeUsers.get(otherUser);

                String strToSearch = "{\"winner\":\"";

                String winner = battle_results.substring(battle_results.indexOf(strToSearch)+strToSearch.length(),
                        battle_results.lastIndexOf("\"}"));

                // Get the battle object for this battle:
                Battle battle =  BattleCtrl.getBattle(battle_id);

                String player1Username = battle.getPlayer1_username();

                BattleResponse userResponse = new BattleResponse(battle.getPlayer1_username(), battle.getPlayer2_username(), winner, "none");

                BattleResponse otherUserResponse = new BattleResponse(battle.getPlayer1_username(), battle.getPlayer2_username(), winner, "none");

                User otherUserObject = User.getUserByUsername(otherUser);
                User thisUserObject = User.getUserByUsername(username);

                if (winner.equals(username)) {
                    // Then this user is the winner

                    thisUserObject.setRating(thisUserObject.getRating() + 30);
                    otherUserObject.setRating(otherUserObject.getRating() - 30);

                    // Set the reward for this user
                    if (Math.random() < 0.2) {
                        // 20% chance to add equipment on a win
                        Equipment generatedEquipment = Equipment.GenerateEquipment(thisUserObject.getRating(), Equipment.getRandomEquipmentType());
                        InventoryCtrl.addEquipment(otherUser, generatedEquipment);

                        userResponse.setReward(generatedEquipment);
                    } else {
                        // 80% chance to add a card on a win
                        Card generatedCard = Card.GenerateCard(thisUserObject.getRating(), Card.getRandomCardType());
                        InventoryCtrl.addCard(otherUser, generatedCard);
                        userResponse.setReward(generatedCard);
                    }

                } else if (winner.equals(otherUser)){

                    // Then the other person won

                    otherUserObject.setRating(otherUserObject.getRating() + 30);
                    thisUserObject.setRating(thisUserObject.getRating() - 30);

                    // Set the reward to the other guy
                    if (Math.random() < 0.2) {
                        // 20% chance to add equipment on a win
                        Equipment generatedEquipment = Equipment.GenerateEquipment(otherUserObject.getRating(), Equipment.getRandomEquipmentType());
                        InventoryCtrl.addEquipment(otherUser, generatedEquipment);
                        otherUserResponse.setReward(generatedEquipment);
                    } else {
                        // 80% chance to add a card on a win
                        Card generatedCard = Card.GenerateCard(otherUserObject.getRating(), Card.getRandomCardType());
                        InventoryCtrl.addCard(otherUser, generatedCard);
                        otherUserResponse.setReward(generatedCard);
                    }

                }

                thisUserObject.save();
                otherUserObject.save();

                otherSession.getRemote().sendString(toJson(new WebSocketMessage("Battle Data1", battle_results)));
                user.getRemote().sendString(toJson(new WebSocketMessage("Battle Data1", battle_results)));

                otherSession.getRemote().sendString(toJsonNoEscapes(new WebSocketMessage("Battle Data2", otherUserResponse)));
                user.getRemote().sendString(JsonUtil.toJsonNoEscapes(new WebSocketMessage("Battle Data2", userResponse)));

                activeUsers.remove(otherUser);
                activeUsers.remove(username);

            }

            // Send battle results back to UI
            user.getRemote().sendString(toJson(new WebSocketMessage("Battle info: ", "Battle data received. Please don't click the button again, or this all breaks.")));

        }catch(Exception e){
            e.printStackTrace();
        }
    }

    public boolean checkReadiness(String battle_id){
        return BattleCtrl.readyToStart(battle_id);
    }

    private class BattleResponse{
        //String battle_response;
        String winner;
        Object reward;
        String player1;
        String player2;

        public BattleResponse(String username1, String username2, String winner, Object reward){
            this.player1 = username1;
            this.player2 = username2;
            //this.battle_response = res;
            this.winner = winner;
            this.reward = reward;
        }

        public void setReward(Object reward){
            this.reward = reward;
        }

    }



}
