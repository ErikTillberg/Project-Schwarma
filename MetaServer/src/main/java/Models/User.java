package Models;

import Annotations.Exclude;
import Main.Constants;
import Utilities.ResponseError;
import jdk.nashorn.internal.ir.annotations.Reference;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.query.Query;

import java.util.List;

import static Utilities.DBConn.datastore;

/**
 * Created by Erik Tillberg on 1/26/2017.
 */

@Entity()
public class User {

    public static final String WARRIOR = "warrior";
    public static final String MAGE = "mage";
    public static final String THIEF = "thief";

    @Id
    private ObjectId id;

    private String email;
    private String username;
    private String sessionToken;

    private Equipment equippedChest;
    private Equipment equippedWeapon;
    private Equipment equippedBoots;
    private List<Card> equippedCards;

    private String characterType;

    private double attack_percentage;
    private double defense_percentage;
    private double mobility_percentage;

    private double attack_modifier;
    private double defence_modifier;
    private double mobility_modifier;

    private int rating;

    private int coins;

    //This means that the password won't be returned by GSON
    @Exclude
    private String password;

    @Exclude
    private String salt;

    private List<Card> cards;
    private List<Equipment> equipment;


    public User(){
        super();
    }

    public User(String email, String username, String password, String salt){
        this.email = email;
        this.username = username;
        this.password = password; //this will already be hashed.
        this.salt = salt;
        this.rating = Constants.int_constants.get("initial_player_rating");
        this.coins = 0;
    }

    ///////////////////////
    /////GETTER&SETTER/////
    ///////////////////////

    public ObjectId getId() { return id; }

    public void setId(ObjectId id) { this.id = id; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getSessionToken() { return sessionToken; }

    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }

    public int getRating() { return rating; }

    public void setRating(int rating) {
        if (rating < 0){
            this.rating = 0;
            return;
        }
        this.rating = rating;
    }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getSalt() { return salt; }

    public void setSalt(String salt) { this.salt = salt; }

    public List<Card> getCards() { return cards; }

    public void setCards(List<Card> cards) { this.cards = cards; }

    public List<Equipment> getEquipment() { return equipment; }

    public void setEquipment(List<Equipment> equipment) { this.equipment = equipment; }

    public String getCharacterType() {
        return characterType;
    }

    public void setCharacterType(String characterType) {
        this.characterType = characterType;
    }

    public Equipment getEquippedChest() {
        return equippedChest;
    }

    public void setEquippedChest(Equipment equippedChest) {
        this.equippedChest = equippedChest;
    }

    public Equipment getEquippedWeapon() {
        return equippedWeapon;
    }

    public void setEquippedWeapon(Equipment equippedWeapon) {
        this.equippedWeapon = equippedWeapon;
    }

    public Equipment getEquippedBoots() {
        return equippedBoots;
    }

    public void setEquippedBoots(Equipment equippedBoots) {
        this.equippedBoots = equippedBoots;
    }

    public List<Card> getEquippedCards() {
        return equippedCards;
    }

    public void setEquippedCards(List<Card> equippedCards) {
        this.equippedCards = equippedCards;
    }

    public double getAttack_percentage() {
        return attack_percentage;
    }

    public void setAttack_percentage(double attack_percentage) {
        this.attack_percentage = attack_percentage;
    }

    public double getDefense_percentage() {
        return defense_percentage;
    }

    public void setDefense_percentage(double defense_percentage) {
        this.defense_percentage = defense_percentage;
    }

    public double getMobility_percentage() {
        return mobility_percentage;
    }

    public void setMobility_percentage(double mobility_percentage) {
        this.mobility_percentage = mobility_percentage;
    }

    public double getAttack_modifier() {
        return attack_modifier;
    }

    public void setAttack_modifier(double attack_modifier) {
        this.attack_modifier = attack_modifier;
    }

    public double getDefence_modifier() {
        return defence_modifier;
    }

    public void setDefence_modifier(double defence_modifier) {
        this.defence_modifier = defence_modifier;
    }

    public double getMobility_modifier() {
        return mobility_modifier;
    }

    public void setMobility_modifier(double mobility_modifier) {
        this.mobility_modifier = mobility_modifier;
    }

    public int getCoins() {
        return coins;
    }


    /**
     * Changes the amount of coins a user has, (change can be positive or negative)
     * returns null if you go below 0, and doesn't make a change.
     * @param change
     * @return
     */
    public Integer changeCoins(int change){
        if ((coins + change) < 0){
            return null;
        } else {
            this.coins += change;
            return this.coins;
        }

    }

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

    public static boolean isValidCharacterType(String characterType){
        return characterType.equals(MAGE) || characterType.equals(THIEF) || characterType.equals(WARRIOR);
    }

    public static User getUserByUsername(String username){
        //Get user username:
        final Query<User> query = datastore.createQuery(User.class)
                .field("username").equal(username);

        User user;
        try {
            user = query.get();
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
        return user;
    }

    public boolean save(){
        datastore.save(this);
        return true;
    }

}
