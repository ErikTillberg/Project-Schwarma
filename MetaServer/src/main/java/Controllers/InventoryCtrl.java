package Controllers;

import Models.Card;
import Models.Equipment;
import Models.User;
import Utilities.InventoryUtil;
import Utilities.JsonUtil;
import Utilities.ResponseError;
import Utilities.ResponseSuccess;
import org.bson.types.ObjectId;
import org.eclipse.jetty.server.Response;
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

        User user = User.getUserByUsername(username);

        int newWealth = user.changeCoins(aGear.getValue());

        final Query<User> user_query = datastore.createQuery(User.class).field("username").equal(username);
        ops = datastore.createUpdateOperations(User.class).removeAll("equipment", aGear).set("coins", newWealth);

        try {
            datastore.update(user_query, ops);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }

        return user;
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
        final User user = User.getUserByUsername(username);
        final Query<User> user_query = datastore.createQuery(User.class).field("username").equal(username);

        int newWealth = user.changeCoins(aCard.getValue());

        ops = datastore.createUpdateOperations(User.class).removeAll("cards", aCard).set("coins", newWealth);

        try {
            datastore.update(user_query, ops);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }

        return user;
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
        Equipment equippedChest = JsonUtil.parseToEquipment(messageBody.get("equippedChest"));
        Equipment equippedBoots = JsonUtil.parseToEquipment(messageBody.get("equippedBoots"));
        Equipment equippedWeapon = JsonUtil.parseToEquipment(messageBody.get("equippedWeapon"));

        // If one of the fields are missing, then that's not good, so return an error.
        if (username == null || equippedChest == null || equippedBoots == null || equippedWeapon == null){
            return new ResponseError("Error", "Invalid form submission");
        }

        //Otherwise, continue on.

        User user = User.getUserByUsername(username);

        if (user == null){
            System.out.println("Could not find user");
            return new ResponseError("Invalid username", "Could not find user " + username);
        }

        //Validate that the user has the equipment that was sent to us.
        boolean hasChest = false;
        boolean hasBoots = false;
        boolean hasWeapon = false;
        //Nice.

        for (Equipment equipment : user.getEquipment()){
            if (equipment.equals(equippedChest)){
                hasChest = true;
            }

            if (equipment.equals(equippedBoots)){
                hasBoots = true;
            }

            if (equipment.equals(equippedWeapon)){
                hasWeapon = true;
            }
        }
        //If they don't have one of the things they say they have, they should be punished.
        if (!(hasBoots && hasChest && hasWeapon)){
            System.out.println("Does not have equipment as specified");
            return new ResponseError("Error in equipment", "User doesn't have specified equipment");
        }

        // Otherwise we are good to store the equipped items in the user database.
        user.setEquippedBoots(equippedBoots);
        user.setEquippedChest(equippedChest);
        user.setEquippedWeapon(equippedWeapon);
        user.save();

        return user;

    }

}