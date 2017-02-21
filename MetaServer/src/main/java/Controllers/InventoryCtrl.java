package Controllers;

import Models.Card;
import Models.Equipment;
import Models.User;
import Utilities.InventoryUtil;
import Utilities.ResponseError;
import Utilities.ResponseSuccess;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;

import java.util.List;

import static Utilities.DBConn.datastore;

/**
 * @author FrancescosMac
 * @date 17-02-16.
 */
public class InventoryCtrl {


    public static Object listInventory(String username){

        if (username == null) return new ResponseError("Missing username");

        User user = null;
        final Query<User> user_query = datastore.createQuery(User.class).field("username").equal(username);

        try{
            user = user_query.get();
        }
        catch (Exception e){
            System.out.println("Error retrieving the user");
        }
        if (user==null){
            return new ResponseSuccess("Could not find user %s", username);
        }

        List<Card> cards = user.getCards();
        List<Equipment> equipment = user.getEquipment();

        return new InventoryUtil(cards, equipment);
    }


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


    public static Object deleteEquipment(String username, Equipment aGear){

        if (username == null){ return new ResponseError("Missing username"); }
        else if (aGear == null) { return new ResponseError("Missing item to delete"); }
        final UpdateOperations<User> ops;

        final Query<User> user_query = datastore.createQuery(User.class).field("username").equal(username);
        ops = datastore.createUpdateOperations(User.class).removeAll("equipment", aGear);


        try {
            datastore.update(user_query, ops);
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


    public static Object deleteCard(String username, Card aCard){

        if (username == null){ return new ResponseError("Missing username"); }
        else if (aCard == null) { return new ResponseError("Missing item to delete"); }
        final UpdateOperations<User> ops;

        final Query<User> user_query = datastore.createQuery(User.class).field("username").equal(username);
//<<<<<<< HEAD
//
//
//        if (item_type.equalsIgnoreCase("Card"))
//            ops = datastore.createUpdateOperations(User.class).removeAll("cards", item_id);
//        else
//            ops = datastore.createUpdateOperations(User.class).removeAll("equipment", item_id);
//=======
        ops = datastore.createUpdateOperations(User.class).removeAll("cards", aCard);
//>>>>>>> 0dc361e7cf9a03508b79094f1c9d10a7f587e3d8


        try {
            datastore.update(user_query, ops);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }

        return true;
    }
}
