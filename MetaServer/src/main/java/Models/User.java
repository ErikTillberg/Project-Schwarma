package Models;

import Annotations.Exclude;
import jdk.nashorn.internal.ir.annotations.Reference;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;

import java.util.List;

/**
 * Created by Erik Tillberg on 1/26/2017.
 */

@Entity()
public class User {

    @Id
    private ObjectId id;

    private String email;
    private String username;
    private String sessionToken;

    //This means that the password won't be returned by GSON
    @Exclude
    private String password; //transient variables will be ignored when converting this object to JSON.
    @Exclude
    private String salt;

    @Reference
    private List<Card> cards;

    public User(String email, String username, String password, String salt){
        this.email = email;
        this.username = username;
        this.password = password; //this will already be hashed.
        this.salt = salt;
    }

    ///////////////////////
    /////GETTER&SETTER/////
    ///////////////////////

    public String getSessionToken(){return sessionToken;}

    public void setSessionToken(String sessionToken){this.sessionToken = sessionToken;}

    public ObjectId getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }
}
