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

    //This number represents the maximum rating at which there are no further rewards for gaining a higher rating
    //(in regards to rewards generated). There is still the competitive nature.
    public static int MAX_REWARD_RATING = 3000;

    @Id
    private ObjectId id;

    private String email;
    private String username;
    private String sessionToken;
    private int rating;

    //This means that the password won't be returned by GSON
    @Exclude
    private String password;

    public String getPassword() {
        return password;
    }

    public String getSalt() {
        return salt;
    }

    public List<Card> getCards() {
        return cards;
    }

    @Exclude
    private String salt;

    @Reference
    private List<Card> cards;

    public User(){
        super();
    }

    public User(String email, String username, String password, String salt){
        this.email = email;
        this.username = username;
        this.password = password; //this will already be hashed.
        this.salt = salt;
        this.rating = 1000;
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

    public int getRating() { return rating; }

    public void setRating(int rating) { this.rating = rating; }


    ///////////////////////
    ////////EQUALS ////////
    ///////////////////////

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        if (rating != user.rating) return false;
        if (email != null ? !email.equals(user.email) : user.email != null) return false;
        if (username != null ? !username.equals(user.username) : user.username != null) return false;
        return !(cards != null ? !cards.equals(user.cards) : user.cards != null);

    }

    @Override
    public int hashCode() {
        int result = email != null ? email.hashCode() : 0;
        result = 31 * result + (username != null ? username.hashCode() : 0);
        result = 31 * result + rating;
        result = 31 * result + (cards != null ? cards.hashCode() : 0);
        return result;
    }
}
