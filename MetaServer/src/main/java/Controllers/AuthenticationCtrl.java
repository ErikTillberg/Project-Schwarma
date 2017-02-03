package Controllers;

import Models.User;

import java.math.BigInteger;
import java.security.SecureRandom;

import static Utilities.DBConn.datastore;

/**
 * Created by crese_000 on 2/1/2017.
 */
public class AuthenticationCtrl {

    public static String signup(String email, String username, String password){

        //For now, just save a default user to the database.

        final User porky = new User(email, username, password);
        try{
            datastore.save(porky);
        } catch (Exception e){
            e.printStackTrace();
        }

        return "Signup Success"; //this should be some sort of json node at some point.
    }

    public static String login(String username, String password){
        return "";
    }

    private String generateToken(){
        SecureRandom random = new SecureRandom();
        return new BigInteger(130, random).toString(32);
    }

}
