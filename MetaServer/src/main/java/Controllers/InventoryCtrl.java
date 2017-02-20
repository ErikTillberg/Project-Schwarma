package Controllers;

import Models.Card;
import Models.Equipment;
import Models.User;
import Utilities.ResponseError;
import Utilities.ResponseSuccess;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;

import static Utilities.DBConn.datastore;

/**
 * @author FrancescosMac
 * @date 17-02-16.
 */
public class InventoryCtrl {


    public static Object addEquipment(String username, Equipment aGear){

        if (username == null){ return new ResponseError("Missing username"); }
        else if (aGear == null) { return new ResponseError("Missing gear"); }

        final Query<User> user_query = datastore.createQuery(User.class).field("username").equal(username);
        final UpdateOperations<User> ops = datastore.createUpdateOperations(User.class).addToSet("equipment", aGear);


        try {
            datastore.updateFirst(user_query, ops, true);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }

        return true;
    }


    public static Object addCard(String username, Card aCard){

        if (username == null){ return new ResponseError("Missing username"); }
        else if (aCard == null) { return new ResponseError("Missing card"); }

        final Query<User> user_query = datastore.createQuery(User.class).field("username").equal(username);
        final UpdateOperations<User> ops = datastore.createUpdateOperations(User.class).addToSet("cards", aCard);


        try {
            datastore.updateFirst(user_query, ops, true);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }


        return true;
    }


    public static Object deleteItem(String username, String item_type, String item_id){

        if (username == null){ return new ResponseError("Missing username"); }
        else if (item_type == null) { return new ResponseError("Missing item type"); }
        else if (item_id == null) { return new ResponseError("Missing item id"); }
        final UpdateOperations<User> ops;

        final Query<User> user_query = datastore.createQuery(User.class).field("username").equal(username);


        if (item_type.equals("Card"))
            ops = datastore.createUpdateOperations(User.class).removeAll("cards", item_id);
        else
            ops = datastore.createUpdateOperations(User.class).removeAll("equipment", item_id);


        try {
            datastore.update(user_query, ops);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }

        return true;
    }
}
