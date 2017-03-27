package Controllers;

import Models.Card;
import Models.Equipment;
import Models.User;
import Utilities.ResponseError;
import Utilities.ResponseSuccess;
import org.mindrot.jbcrypt.BCrypt;
import org.mongodb.morphia.query.Query;
import spark.Response;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

import static Utilities.DBConn.datastore;

/**
 * Created by Erik_Tillberg on 2/1/2017.
 *
 * Static class contains many of the functions that require authentication of some sort (login, signup, session tokens etc...)
 * There may be a better name for this class. Who knows.
 */
public class AuthenticationCtrl {

    public static Object signup(String email, String username, String password, String characterType){

        if (email == null || password == null || username == null || characterType == null){
            return new ResponseError("Missing information in request");
        }

        if (!User.isValidCharacterType(characterType)){
            return new ResponseError("Invalid character type");
        }

        User user_username, user_email, new_user = null;

        // Check if user with same username or email already exists
        final Query<User> query_username = datastore.createQuery(User.class).field("username").equal(username);
        final Query<User> query_email = datastore.createQuery(User.class).field("email").equal(email);

        try {
            user_username = query_username.get();
            user_email = query_email.get();
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Something went wrong");
        }

        if ((user_username==null) && (user_email==null)){

            String salt = BCrypt.gensalt(); //Generate a salt to hash the users password
            String hashedPass = BCrypt.hashpw(password, salt);

            new_user = new User(email, username, hashedPass, salt);
            new_user.setCharacterType(characterType);

            switch (characterType){
                case("warrior"):
                    new_user.setAttack_modifier(10);
                    new_user.setDefence_modifier(1);
                    new_user.setMobility_modifier(1);
                    break;
                case("mage"):
                    new_user.setAttack_modifier(10);
                    new_user.setDefence_modifier(2);
                    new_user.setMobility_modifier(2);
                    break;
                case("thief"):
                    new_user.setAttack_modifier(10);
                    new_user.setDefence_modifier(3);
                    new_user.setMobility_modifier(3);
                    break;

            }
            //I'm assuming signing up is an auto-login situation, so assign a token here too.
            new_user.setSessionToken(generateToken());

            //Add some cards on sign up

            ArrayList<Card> cardArrayList = new ArrayList<>();
            ArrayList<Equipment> equipmentArrayList = new ArrayList<>();

            cardArrayList.add(Card.GenerateCard(new_user.getRating(), Card.ATTACK));
            cardArrayList.add(Card.GenerateCard(new_user.getRating(), Card.ATTACK));
            cardArrayList.add(Card.GenerateCard(new_user.getRating(), Card.ATTACK));

            cardArrayList.add(Card.GenerateCard(new_user.getRating(), Card.DEFENSE));
            cardArrayList.add(Card.GenerateCard(new_user.getRating(), Card.DEFENSE));
            cardArrayList.add(Card.GenerateCard(new_user.getRating(), Card.DEFENSE));

            cardArrayList.add(Card.GenerateCard(new_user.getRating(), Card.MOBILITY));
            cardArrayList.add(Card.GenerateCard(new_user.getRating(), Card.MOBILITY));
            cardArrayList.add(Card.GenerateCard(new_user.getRating(), Card.MOBILITY));

            Equipment boots = Equipment.GenerateEquipment(new_user.getRating(), Equipment.BOOTS);
            Equipment weapon = Equipment.GenerateEquipment(new_user.getRating(), Equipment.WEAPON);
            Equipment shield = Equipment.GenerateEquipment(new_user.getRating(), Equipment.SHIELD);

            equipmentArrayList.add(boots);
            equipmentArrayList.add(weapon);
            equipmentArrayList.add(shield);

            new_user.setEquippedBoots(boots);
            new_user.setEquippedChest(weapon);
            new_user.setEquippedWeapon(shield);

            new_user.setEquipment(equipmentArrayList);
            new_user.setCards(cardArrayList);

            try {
                datastore.save(new_user);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseError("Could not create user %s, %s", email, username);
            }
        }

        return new_user;
    }

    /**
     *
     * @param username username to query the database for
     * @param password password that matches the username
     * @return user object if there was a successful login
     */
    public static Object login(String username, String password){

        //First check to see if the parameters are there as required
        if (username == null || password == null){
            return new ResponseError("Missing fields");
        }
        System.out.println("Logging in...");

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

        //If the user exists, let's check the password
        String candidatePassword = BCrypt.hashpw(password, user.getSalt());
        System.out.println(candidatePassword);
        System.out.println(user.getPassword());
        //If the passwords match, there is a successful login and the user object should be returned to the client.
        if (candidatePassword.equals(user.getPassword())){
            return user;
        } else {
            return new ResponseError("Password does not match");
        }

    }

    private static String generateToken(){
        SecureRandom random = new SecureRandom();
        return new BigInteger(130, random).toString(32);
    }

}
