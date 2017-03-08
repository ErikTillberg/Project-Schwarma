package Controllers;

import Models.Battle;
import Models.Card;
import Utilities.ResponseError;
import org.bson.types.ObjectId;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;

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

        return true;
    }


    public static Object updateReadiness(ObjectId battle_id, String user_id, List<Card> user_cards){

        String player_to_update;
        final UpdateOperations<Battle> ops;
        final Query<Battle> battle_query = datastore.createQuery(Battle.class).field("id").equal(battle_id);

        Battle battle = null;
        try{
            battle = battle_query.get();
        }catch (Exception e){
            System.out.println(e);
        }

        if (battle ==null){
            System.out.println("Could not find battle %s" + battle_id.toString());
        }

        if(battle.getPlayer1().equals(user_id))
            player_to_update = "player1_ready";
        else
            player_to_update = "player2_ready";

        ops = datastore.createUpdateOperations(Battle.class).set(player_to_update, true);

        try {
            datastore.update(battle_query, ops);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }

        return true;
    }
    

    public static boolean readyToStart(ObjectId battle_id){

        final Query<Battle> battle_query = datastore.createQuery(Battle.class).field("id").equal(battle_id);

        Battle battle = null;
        try{
            battle = battle_query.get();
        }catch (Exception e){
            System.out.println(e);
        }

        if (battle ==null){
            System.out.println("Could not find battle %s" + battle_id.toString());
        }

        return battle.getPlayer1_ready() && battle.getPlayer2_ready();
    }

}
