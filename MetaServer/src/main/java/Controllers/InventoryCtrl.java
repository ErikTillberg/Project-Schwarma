package Controllers;

import Models.Card;
import Models.Equipment;
import Models.User;
import Utilities.InventoryUtil;
import Utilities.JsonUtil;
import Utilities.ResponseError;
import Utilities.ResponseSuccess;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;

import java.util.ArrayList;
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
        System.out.println("Parsing equipment");

        Equipment equippedChest = JsonUtil.parseToEquipment(messageBody.get("equippedChest").substring(1, messageBody.get("equippedChest").length()-1));
        Equipment equippedBoots = JsonUtil.parseToEquipment(messageBody.get("equippedBoots").substring(1, messageBody.get("equippedBoots").length()-1));
        Equipment equippedWeapon = JsonUtil.parseToEquipment(messageBody.get("equippedWeapon").substring(1, messageBody.get("equippedWeapon").length()-1));

        // If one of the fields are missing, then that's not good, so return an error.
        if (username == null || equippedChest == null || equippedBoots == null || equippedWeapon == null){
            return new ResponseError("Error", "Invalid form submission");
        }

        System.out.println(equippedChest);
        System.out.println(equippedBoots);
        System.out.println(equippedWeapon);

        //Otherwise, continue on.

        User user = User.getUserByUsername(username);

        if (user == null){
            System.out.println("Could not find user");
            return new ResponseError("Invalid username", "Could not find user " + username);
        }



        // Otherwise we are good to store the equipped items in the user database.
        user.setEquippedBoots(equippedBoots);
        user.setEquippedChest(equippedChest);
        user.setEquippedWeapon(equippedWeapon);
        user.save();

        return user;

    }

    public static ArrayList<Card> generateInitialCardInventory(int user_rating, int inventory_ize){

        ArrayList<Card> cardArrayList = new ArrayList<>();

        String [] card_types = {Card.ATTACK, Card.DEFENSE, Card.MOBILITY};

        for (int i = 0; i < card_types.length; i++) {
            for (int j = 0; j < inventory_ize; j++)
                cardArrayList.add(Card.GenerateCard(user_rating, card_types[i]));
        }

        return cardArrayList;
    }

    public static ArrayList<Equipment> generateInitialEquipmentInventory(int user_rating, int inventory_ize){

        ArrayList<Equipment> equipmentArrayList = new ArrayList<>();

        String [] equipment_types = {Equipment.SHIELD, Equipment.BOOTS, Equipment.WEAPON};

        for (int i = 0; i < equipment_types.length; i++) {
            for (int j = 0; j < inventory_ize; j++)
                equipmentArrayList.add(Equipment.GenerateEquipment(user_rating, equipment_types[i]));
        }

        return equipmentArrayList;
    }

}