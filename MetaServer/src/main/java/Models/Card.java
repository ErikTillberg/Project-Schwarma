package Models;

import Main.Constants;
import Resources.StringLists;
import Utilities.RNGUtil;
import com.google.gson.JsonObject;
import jdk.nashorn.internal.ir.annotations.Reference;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;

import jdk.nashorn.internal.ir.annotations.Reference;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Property;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Erik Tillberg on 2/1/2017.
 */

@Entity()
public class Card {

    public static String ATTACK = "attack";
    public static String DEFENSE = "defense";
    public static String MOBILITY = "mobility";

    @Id
    private ObjectId id;

    //the name of the card
    private String name;

    //the type of the card, can be either 'attack', 'defense', 'mobility'
    private String type;
    private String direction = "none";
    private StatBonus statBonus;
    private ElementalStatBonus elementalStatBonus;

    private Trigger trigger = null;

    private Integer value; //Some value, in coins (or Schwarma?)

    //You need the default constructor specific for morphia for some reason
    public Card(){
        super();
    }

    public Card(String name, String type, StatBonus statBonus, ElementalStatBonus elementalStatBonus){
        this.name = name;
        this.type = type;
        this.statBonus = statBonus;
        this.elementalStatBonus = elementalStatBonus;
    }

    ///////////////////////
    ////////EQUALS ////////
    ///////////////////////

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Card card = (Card) o;

        if (id != null ? !id.equals(card.id) : card.id != null) return false;
        if (name != null ? !name.equals(card.name) : card.name != null) return false;
        if (type != null ? !type.equals(card.type) : card.type != null) return false;
        if (statBonus != null ? !statBonus.equals(card.statBonus) : card.statBonus != null) return false;
        if (elementalStatBonus != null ? !elementalStatBonus.equals(card.elementalStatBonus) : card.elementalStatBonus != null)
            return false;
        if (trigger != null ? !trigger.equals(card.trigger) : card.trigger != null) return false;
        return !(value != null ? !value.equals(card.value) : card.value != null);

    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (statBonus != null ? statBonus.hashCode() : 0);
        result = 31 * result + (elementalStatBonus != null ? elementalStatBonus.hashCode() : 0);
        result = 31 * result + (trigger != null ? trigger.hashCode() : 0);
        result = 31 * result + (value != null ? value.hashCode() : 0);
        return result;
    }


    /////////////////////////////////////////
    ///////////GETTER AND SETTERS////////////
    /////////////////////////////////////////

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public StatBonus getStatBonus() {
        return statBonus;
    }

    public void setStatBonus (StatBonus statBonus) {
        this.statBonus = statBonus;
    }

    public ElementalStatBonus getElementalStatBonus() {
        return elementalStatBonus;
    }

    public void setElementalStatBonus(ElementalStatBonus elementalStatBonus) {
        this.elementalStatBonus = elementalStatBonus;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }


    public Trigger getTrigger() {
        return trigger;
    }

    public void setTrigger(Trigger trigger) {
        this.trigger = trigger;
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();

        stringBuilder.append("[")
                .append(this.name)
                .append(", ")
                .append(statBonus)
                .append(", ")
                .append(elementalStatBonus)
                .append(", ")
                .append(value)
                .append("]");

        return stringBuilder.toString();
    }

    /**
     * Function that takes a card and returns its value. This is where the value logic is happenin'.
     * @param card
     * @return
     */
    private static Integer getCardValue(Card card){

        //For now let's just look at the cards stats and tally their values:
        int bonusTotal = 0;
        bonusTotal += (int)card.getStatBonus().getBonus();
        bonusTotal += (int)card.getElementalStatBonus().getBonus();

        //(value/50)^4 is the value of the card, rounded to nearest integer.
        //Subject to change.
        double val = Math.pow((double)bonusTotal/50, 4);

        return (int)Math.round(val);
    }

    /**
     * This method constructs and returns a random card based on the rating that is sent to it
     * @param userRating the rating of the user
     * @param type the type of card to construct
     * @return a randomized card
     */
    public  static Card GenerateCard(int userRating, String type){
        Card card = new Card();
        int rating_range = Constants.int_constants.get("rating_range");

        if (Card.isValidCardType(type)){
            card.setType(type);
        } else { return null; } //If it's not a valid type return null.

        //Decide whether or not an item should have elemental stats:
        //First get the chance of getting an elemental stat:
        //Here the maximum reward is 1.0 or 100% at the maximum reward.
        Double chanceofElementalStat = RNGUtil.getSqrtValueInRange(userRating, 1.0);
        Boolean getsElementalStats = RNGUtil.getRandomBoolean(chanceofElementalStat);

        if(getsElementalStats){
            //Then the card should:
            //a. Decide how many elemental stats are to be generated
            //b. Build that number of random elemental stats and add them to the card

            //FOR NOW LETS JUST ADD ONE ELEMENTAL STAT FOR FUN
            //IT WILL HAVE A RANDOM ELEMENT TYPE AND BE OF THE STAT TYPE OF THE CARD
            Double maxReward = 50.0;

            Double min = RNGUtil.getSqrtValue(userRating - rating_range, maxReward);
            Double max = RNGUtil.getSqrtValue(userRating + rating_range, maxReward);

            card.setElementalStatBonus(ElementalStatBonus.GenerateRandomElementalStatBonusWithRandomElement(min, max, type)); //wowza


        } else{
            card.setElementalStatBonus(ElementalStatBonus.GenerateRandomElementalStatBonusWithRandomElement(0, 0, type)); //wowza
        }

        //Every card should have some sort of bonus that is given to the card.
        //To start, let's start with a single bonus, to the stat of the type of card that is being created.
        Double maxReward = 50.0; //I guess just +50% for now is fine I dunno
        Double min = RNGUtil.getSqrtValue(userRating - rating_range, maxReward);
        Double max = RNGUtil.getSqrtValue(userRating + rating_range, maxReward);


        StatBonus statBonus;
        if(type.equals(MOBILITY)) {
            statBonus = StatBonus.GenerateRandomStatBonus(1, 5, type);
            if (Math.random() > 0.5)
                card.setDirection("away");
            else
                card.setDirection("toward");
        }
        else
            statBonus = StatBonus.GenerateRandomStatBonus(min, max, type);

        if(statBonus == null){return null;}

        //Add the stat bonus list to the card.
        card.setStatBonus(statBonus);

        card.setTrigger(new Trigger());

        //Last thing to do is add the name of the card. Let's do this by getting random strings from lists.
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(type).append(" card of ").append(StringLists.getRandomCardAdjective()).append(" ").append(StringLists.getRandomCardNoun());

        String name = stringBuilder.toString();
        card.setName(name);

        //I think that's everything!!!

        card.setValue(Card.getCardValue(card));

        return card;
    }

    public static boolean isValidCardType(String type){
        return type.equals(Card.ATTACK) || type.equals(Card.DEFENSE) || type.equals(Card.MOBILITY);
    }


    public static JsonObject simplifyCardForBattle(Card card){
        JsonObject card_info = new JsonObject();

        card_info.addProperty("name", card.getName());
        card_info.addProperty("direction", card.getDirection());
        card_info.addProperty("value", card.getStatBonus().getBonus());
        card_info.addProperty("element", card.getElementalStatBonus().getElement());
        card_info.addProperty("elemental_value", card.getElementalStatBonus().getBonus());

        return card_info;
    }

    public static JsonObject simplifyTriggerForBattle(Card card){
        JsonObject trigger_info = new JsonObject();
        JsonObject action = new JsonObject();

        action.addProperty("action_type", card.getType());
        action.addProperty("item", card.getName());

        trigger_info.add("condition", card.getTrigger().simplifyForBattle());
        trigger_info.add("action", action);

        return trigger_info;
    }
}
