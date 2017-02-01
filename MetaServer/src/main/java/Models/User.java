package Models;

import jdk.nashorn.internal.ir.annotations.Reference;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Property;

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
    private String password;

    @Reference
    private List<Card> cards;

    public User(String email, String username, String password){
        this.email = email;
        this.username = username;
        this.password = password; //this will already be hashed.
    }

    ///////////////////////
    /////GETTER&SETTER/////
    ///////////////////////

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
