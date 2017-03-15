package Controllers;

import Models.Battle;
import Models.Equipment;
import Models.User;
import Utilities.JsonUtil;
import Utilities.ResponseError;
import Utilities.ResponseSuccess;
import Utilities.WebSocketMessage;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.bson.types.ObjectId;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.mongodb.morphia.query.Query;

import java.util.ArrayList;
import java.util.List;
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

    private Integer RATING_MATCH_THRESHOLD = 200;

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
        try{
            user.getRemote().sendString(toJson(new WebSocketMessage("connected", "Wow, thanks for connecting, that's so nice")));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnWebSocketClose
    public void onClose(Session userSession, int statusCode, String reason){
        System.out.println("Closing matchmaking connection");

        User user = null;
        for (Map.Entry<User, Session> entry : userMatchmakingMap.entrySet()){
            if (entry.getValue().equals(userSession)){
                user = entry.getKey();
                break;
            }
        }

        //Couldn't find the user.
        if (user == null){
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
                userSession.close(4000, "couldn't find user");
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
                userSession.close(4000, "Could not find user");
                return;
            }

            if (user == null){
                userSession.close(4000, "Could not find user");
                return;
            }


            //If the user isn't in the matchmaking list, then you should definitely add them
            if (userMatchmakingMap.get(user) == null){
                userMatchmakingMap.put(user, userSession);
            } else { //If they ARE in the list, then you definitely should NOT add them.
                System.out.println("User already in the user map");
                userSession.getRemote().sendString(toJson(new WebSocketMessage("error", "user already matchmaking")));
                return;
            }

//          System.out.println("PRINTING EVERYONE IN THE USER MAP");
//
//            for(Map.Entry<User, Session> entry: userMatchmakingMap.entrySet()){
//                System.out.println(entry.getKey().getUsername());
//            }

            //Try find a match
            attemptToFindMatch(user, userSession);

            userSession.getRemote().sendString(toJson(new WebSocketMessage("success", "matchmaking started")));

        } catch (Exception e) {
            e.printStackTrace();
            try{
                userSession.getRemote().sendString("Error in message");
            } catch (Exception e2){
                e2.printStackTrace();
                userSession.close(4000, "Something went horribly wrong");
            }
        }

    }

    /**
     * This function should try to find a match for the user 'user' who has session 'userSession'
     *
     * The function looks through the list of all the people looking for matches, and matches the user
     * to the person in the list who is closest to their rating, which a certain threshold.
     *
     * The threshold is a variable at the top of this class, I'll set it to 200 for now, that means that a user of rating
     * 1300 can only be matched to some user whose rating holds: 1100 <= theirRating <= 1300
     *
     * @param user
     * @param userSession
     */
    private void attemptToFindMatch(User user, Session userSession){

        if (userMatchmakingMap.size() <= 1){ //If you're the only person in here, maybe don't match with yourself.
            return;
        }

        //Initialize the closest user to the user being matched to nothing
        User closestUser = null;

        //this is a very big number
        int minRatingDiff = Integer.MAX_VALUE;

        for (Map.Entry<User, Session> entry : userMatchmakingMap.entrySet()){
            int diff = Math.abs(entry.getKey().getRating() - user.getRating());

            if (diff < minRatingDiff && !user.equals(entry.getKey())){

                //If the difference is smaller than the current min, change the user and the difference
                closestUser = entry.getKey();
                minRatingDiff = diff;
            }
        }

        System.out.println(closestUser);

        //Here we'll check if the difference is within the threshold that was set
        if(!(minRatingDiff <= RATING_MATCH_THRESHOLD)){
            //Then we should just return and not continue, no match was found.
            return;
        }

        //If you've gotten this far, you're doing good, kid. We need to the user object of whoever we matched with
        //and we also need to remove both the user and the user we matched with from the untimely matching making list of endowment

        //Build the response
        WebSocketMessage responseToUser = new WebSocketMessage("match_found", closestUser);
        WebSocketMessage responseToMatchedUser = new WebSocketMessage("match_found", user);

        Session matchedUserSession = userMatchmakingMap.get(closestUser);

        //Build the battle object for the two users

        List<Equipment> userEquip = new ArrayList<>();

        userEquip.add(user.getEquippedBoots());
        userEquip.add(user.getEquippedChest());
        userEquip.add(user.getEquippedWeapon());

        List<Equipment> matchedEquip = new ArrayList<>();

        matchedEquip.add(closestUser.getEquippedBoots());
        matchedEquip.add(closestUser.getEquippedChest());
        matchedEquip.add(closestUser.getEquippedWeapon());

        Battle battle = Battle.createNewBattle(user.getUsername(), closestUser.getUsername(), userEquip, matchedEquip);
        ObjectId battle_id = (ObjectId) BattleCtrl.addBattle(battle);

        //Send the messages to confirm the matchmaking.
        try {
            userSession.getRemote().sendString(toJson(new WebSocketMessage("battle_id", battle_id)));
            userSession.getRemote().sendString(toJson(responseToUser));
            matchedUserSession.getRemote().sendString(toJson(responseToMatchedUser));
        } catch (Exception e){
            e.printStackTrace();
            return;
        }

        //Good job, remove the matched users from the list.
        userMatchmakingMap.remove(closestUser);
        userMatchmakingMap.remove(user);

        //all done, nice.
    }

}
