package Controllers;

import Models.Battle;
import Models.Card;
import Utilities.BattlePlayer;
import Utilities.JsonUtil;
import Utilities.ResponseError;
import com.google.gson.JsonObject;
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

    public static Object addBattle(Battle battle){

        try {
            datastore.save(battle);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }

        return battle.getId();
    }


    public static Object updateReadiness(String battle_id, String user_id, String att_attribute,
                                         String def_attribute, String mov_attribute, List<Card> user_cards){

        String player_to_update;
        final UpdateOperations<Battle> update_readiness;
        final UpdateOperations<Battle> update_cards;
        final UpdateOperations<Battle> update_battleplayer;

        System.out.println(battle_id);

        final Query<Battle> battle_query = datastore.createQuery(Battle.class).field("_id").equal(new ObjectId(battle_id));

        Battle battle = null;
        try{
            battle = battle_query.get();
        }catch (Exception e){
            System.out.println(e);
            System.out.println("error1");
        }

        if (battle ==null){
            System.out.println("Could not find battle: " + battle_id.toString());
        }

        BattlePlayer battle_player;
        if(battle.getPlayer1().equals(user_id)){
            player_to_update = "player1";
            battle_player = battle.getPlayer1_battleplayer();
        }
        else {
            player_to_update = "player2";
            battle_player = battle.getPlayer2_battleplayer();
        }

        battle_player.prepareForBattle(user_id,att_attribute, def_attribute, mov_attribute, user_cards);

        update_readiness = datastore.createUpdateOperations(Battle.class).set(player_to_update+"_ready", true);
        update_cards = datastore.createUpdateOperations(Battle.class).set(player_to_update+"_cards", user_cards);
        update_battleplayer = datastore.createUpdateOperations(Battle.class).set(player_to_update+"_battleplayer", battle_player);

        try {
            datastore.update(battle_query, update_readiness);
            datastore.update(battle_query, update_cards);
            datastore.update(battle_query, update_battleplayer);
        } catch (Exception e){
            e.printStackTrace();
            System.out.println("error2");
            return new ResponseError("Something went wrong");
        }

        return battle;
    }
    

    public static boolean readyToStart(Battle battle){

        if (battle ==null){
            System.out.println("BATTLECTRL: readyToStart");
            System.out.println("Could not find battle %s" + battle.toString());
        }

        return battle.getPlayer1_ready() && battle.getPlayer2_ready();
    }

    public static String postToSimServer(String battle_id)
            throws ClientProtocolException, IOException {

        final Query<Battle> battle_query = datastore.createQuery(Battle.class).field("id").equal(new ObjectId(battle_id));

        Battle battle = null;
        try{
            battle = battle_query.get();
        }catch (Exception e){
            System.out.println(e);
        }

        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://localhost:3000");

        String json = JsonUtil.toJson(battle);
        StringEntity entity = new StringEntity(json);
        httpPost.setEntity(entity);
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-type", "application/json");
        System.out.println(entity);

        CloseableHttpResponse response = client.execute(httpPost);
        System.out.println(response.getStatusLine().getStatusCode());
        client.close();

        return EntityUtils.toString(response.getEntity());
    }
}
