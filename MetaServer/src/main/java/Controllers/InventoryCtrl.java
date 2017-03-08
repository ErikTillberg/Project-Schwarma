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
import java.util.Map;

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
        ops = datastore.createUpdateOperations(User.class).removeAll("cards", aCard);


        try {
            datastore.update(user_query, ops);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }

        return true;
    }

    /**
     * Function takes a message body of the form:
     * {
     *     username: 'some user',
     *     equippedChest: 'some chest ID',
     *     equippedBoots: 'some boots ID',
     *     equippedWeapon: 'some weapon ID'
     * }
     * @param messageBody
     * @return
     */
    public static Object setActiveEquipment(Map<String, String> messageBody){
        String username = messageBody.get("username");
        String equippedChestID = messageBody.get("equippedChest");
        String equippedBootsID = messageBody.get("equippedBoots");
        String equippedWeaponID = messageBody.get("equippedWeapon");

        // If one of the fields are missing, then that's not good, so return an error.
        if (username == null || equippedChestID == null || equippedBootsID == null || equippedWeaponID == null){
            return new ResponseError("Error", "Invalid form submission");
        }

        //Otherwise, continue on.

        //Get user username:
        final Query<User> query = datastore.createQuery(User.class)
                .field("username").equal(username);

        User user;
        try {
            user = query.get();
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }
        if (user==null){
            return new ResponseError("Could not find user %s", username);
        }

    return null;

    }

}