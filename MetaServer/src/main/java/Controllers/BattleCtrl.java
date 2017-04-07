package Controllers;

import Models.Battle;
import Models.Card;
import Models.User;
import Utilities.JsonUtil;
import Utilities.ResponseError;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.bson.types.ObjectId;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;

import java.io.*;
import java.util.List;

import static Utilities.DBConn.datastore;

/**
 * @author FrancescosMac
 * @date 17-03-08.
 */
public class BattleCtrl {

    public static String getOtherUser(String battle_id, String username){

        //Get the battle object
        final Query<Battle> battle_query = datastore.createQuery(Battle.class).field("id").equal(new ObjectId(battle_id));

        Battle battle = null;
        try{
            battle = battle_query.get();
        }catch (Exception e){
            return "Error retrieving battle: " + e + "\n Battle id you were looking for: " + battle_id;
        }

        String user1 = battle.getPlayer1_username();
        String user2 = battle.getPlayer2_username();

        return user1.equals(username)? user2 : user1;

    }


    /**
     * This function simply queries the database for a given battle ID and returns the corresponding battle object
     *
     * @param battleId
     * @return battle
     */
    public static Battle getBattle(String battleId){
        final Query<Battle> battle_query = datastore.createQuery(Battle.class).field("id").equal(new ObjectId(battleId));

        Battle battle = null;
        try{
            battle = battle_query.get();
        }catch (Exception e){
            return null;
        }

        return battle;

    }


    /**
     * This function converts a battle object into a database storable object and returns the id of the newly
     * created entry
     *
     * @param battle
     * @return new battle id
     */
    public static Object addBattle(Battle battle){

        try {
            datastore.save(battle);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }

        return battle.getId();
    }


    /**
     * This function is invoked when a player is ready to fight. At this point the have selected the cards they wish
     * to use, and the relative action percentages for each of attack, defense, and mobility. This function updates
     * the both player and battle with this newly acquired information. It also sets the player status, for this specific
     * battle to ready.
     *
     * @param  battle_id,  user_id,  att_attribute, def_attribute,  mov_attribute, List<Card> user_cards
     * @return true
     */
    public static Object updateReadiness(String battle_id, String user_id, String att_attribute,
                                         String def_attribute, String mov_attribute, List<Card> user_cards){



        updatePlayerAttributesAndCards(user_id, att_attribute, def_attribute, mov_attribute, user_cards);
        updatePlayerReadyStatus(battle_id, user_id);


        if (readyToStart(battle_id)) {
            try {
                String simulation_results = postToSimServer(battle_id);
            } catch (Exception e) {
                return "Something went wrong with the simulation: " + e;
            }
        }
        else
            System.out.println("Waiting for opponent");

        return true;
    }


    /**
     * This function carries out the specific database updates required to updated player cards, and battle attributes
     *
     * @param username,  att_attribute, def_attribute,  mov_attribute, List<Card> user_cards
     * @return true
     */
    public static Object updatePlayerAttributesAndCards(String username, String att_attribute, String def_attribute,
                                                        String mov_attribute, List<Card> user_cards){

        final UpdateOperations<User> update_user;
        final Query<User> user_query = datastore.createQuery(User.class).field("username").equal(username);


        update_user = datastore.createUpdateOperations(User.class).set("equippedCards", user_cards)
                                                                  .set("attack_percentage", Double.parseDouble(att_attribute))
                                                                  .set("defense_percentage", Double.parseDouble(def_attribute))
                                                                  .set("mobility_percentage", Double.parseDouble(mov_attribute));

        try {
            datastore.findAndModify(user_query, update_user);
        } catch (Exception e){
            return "Error updating user: " + e + "\n User id you were updating: " + username;
        }

        return true;
    }


    /**
     * This function carries out the player ready status update with regards to a specific battle
     *
     * @param battle_id, player
     * @return true
     */
    public static Object updatePlayerReadyStatus(String battle_id, String player){

        String player_to_update;

        final UpdateOperations<Battle> update_readiness;
        final Query<Battle> battle_query = datastore.createQuery(Battle.class).field("id").equal(new ObjectId(battle_id));

        Battle battle = null;
        try{
            battle = battle_query.get();
        }catch (Exception e){
            return "Error retrieving battle: " + e + "\n Battle id you were looking for: " + battle_id;
        }


        if(battle.getPlayer1_username().equals(player))
            player_to_update = "player1";

        else
            player_to_update = "player2";


        update_readiness = datastore.createUpdateOperations(Battle.class).set(player_to_update + "_ready", true);

        try {
            datastore.update(battle_query, update_readiness);
        } catch (Exception e){
            return "Error updating battle: " + e + "\n Battle id you were updating for: " + battle_id;
        }

        return true;
    }



    /**
     * This function is performed after each player updated to check if both players are ready to battle. If so,
     * it returns true, false otherwise
     *
     * @param battle_id
     * @return weather both players are ready to fight or not
     */
    public static boolean readyToStart(String battle_id){

        final Query<Battle> battle_query = datastore.createQuery(Battle.class).field("id").equal(new ObjectId(battle_id));

        Battle battle = null;
        try{
            battle = battle_query.get();
        }catch (Exception e){
            System.out.println(e);
        }

        if (battle ==null){
            System.out.println("Could not find battle %s" + battle_id);
        }

        return battle.getPlayer1_ready() && battle.getPlayer2_ready();
    }



    /**
     * This function executes the POST request from the metaserver to the Simulation server. It packages the request
     * including all the required battle info in the body of the request, and send it over. The battle results generated
     * by the Simulation server are sent back as the function return value.
     *
     * @param battle_id
     * @return battle results
     */
    public static String postToSimServer(String battle_id)
            throws ClientProtocolException, IOException {

        String battle_sim_format = Battle.prepareForSimulation(battle_id);
        System.out.println("----BATTLE SIM FORMAT -----");
        System.out.println(battle_sim_format);


        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://54.149.48.108:8080");

        String json = JsonUtil.toJson(battle_sim_format);

        StringEntity entity = new StringEntity(json, "UTF-8");
        entity.setContentType("application/json");
        httpPost.setEntity(entity);
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-type", "application/json");

        CloseableHttpResponse response = client.execute(httpPost);
        System.out.println(response.getStatusLine().getStatusCode());
        System.out.println("----------- RESPONSE -----------");
        String results = EntityUtils.toString(response.getEntity());

        System.out.println(results);


        client.close();

        return results;
    }
}
