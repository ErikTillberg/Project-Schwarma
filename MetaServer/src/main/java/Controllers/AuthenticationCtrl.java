package Controllers;

import Models.User;
import Utilities.ResponseError;
import org.mindrot.jbcrypt.BCrypt;
import spark.Response;

import java.math.BigInteger;
import java.security.SecureRandom;

import static Utilities.DBConn.datastore;

/**
 * Created by Erik_Tillberg on 2/1/2017.
 *
 * Static class contains many of the functions that require authentication of some sort (login, signup, session tokens etc...)
 * There may be a better name for this class. Who knows.
 */
public class AuthenticationCtrl {

    public static Object signup(String email, String username, String password){

        if (email == null || password == null || username == null){
            return new ResponseError("Missing information in request");
        }

        String salt = BCrypt.gensalt(); //Generate a salt to hash the users password

        String hashedPass = BCrypt.hashpw(password, salt);

        final User user = new User(email, username, hashedPass, salt);

        //I'm assuming signing up is an auto-login situation, so assign a token here too.
        user.setSessionToken(generateToken());

        try{
            datastore.save(user);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseError("Could not create user %s, %s", email, username);
        }

        return user;
    }

    public static Object login(String username, String password){
        return null;
    }

    private static String generateToken(){
        SecureRandom random = new SecureRandom();
        return new BigInteger(130, random).toString(32);
    }

}
