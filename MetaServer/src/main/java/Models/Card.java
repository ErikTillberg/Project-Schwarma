package Models;

import Resources.StringLists;
import Utilities.RNGUtil;
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
    private List<StatBonus> statBonusList = new ArrayList<StatBonus>();
    private List<ElementalStatBonus> elementalStatBonusList = new ArrayList<ElementalStatBonus>();

    private Integer value; //Some value, in coins (or Schwarma?)

    //You need the default constructor specific for morphia for some reason
    public Card(){
        super();
    }

    public Card(String name, String type, List<StatBonus> statBonusList, List<ElementalStatBonus> elementalStatBonusList){
        this.name = name;
        this.type = type;
        this.statBonusList = statBonusList;
        this.elementalStatBonusList = elementalStatBonusList;
    }

    ///////////////////////
    ////////EQUALS ////////
    ///////////////////////

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Card card = (Card) o;

        if (name != null ? !name.equals(card.name) : card.name != null) return false;
        if (type != null ? !type.equals(card.type) : card.type != null) return false;
        if (statBonusList != null ? !statBonusList.equals(card.statBonusList) : card.statBonusList != null)
            return false;
        return !(elementalStatBonusList != null ? !elementalStatBonusList.equals(card.elementalStatBonusList) : card.elementalStatBonusList != null);

    }

    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (statBonusList != null ? statBonusList.hashCode() : 0);
        result = 31 * result + (elementalStatBonusList != null ? elementalStatBonusList.hashCode() : 0);
        return result;
    }



    /**
     * This method constructs and returns a random card based on the rating that is sent to it
     * @param userRating the rating of the user
     * @param type the type of card to construct
     * @return a randomized card
     */
    public static Card GenerateCard(int userRating, String type){
        Card card = new Card();

        if (Card.isValidCardType(type)){
            card.setType(type);
        } else { return null; } //If it's not a valid type return null.

        //Decide whether or not an item should have elemental stats:
        //First get the chance of getting an elemental stat:
        //Here the maximum reward is 1.0 or 100% at the maximum reward.
        Double chanceofElementalStat = RNGUtil.getSqrtValueInRange(userRating, 1.0);
        Boolean getsElementalStats = RNGUtil.getRandomBoolean(chanceofElementalStat);
        ElementalStatBonus elementalStatBonus;
        ArrayList<ElementalStatBonus> elementalStatBonusArrayList = new ArrayList<>();

        if(getsElementalStats){
            //Then the card should:
            //a. Decide how many elemental stats are to be generated
            //b. Build that number of random elemental stats and add them to the card

            //FOR NOW LETS JUST ADD ONE ELEMENTAL STAT FOR FUN
            //IT WILL HAVE A RANDOM ELEMENT TYPE AND BE OF THE STAT TYPE OF THE CARD
            Double maxReward = 50.0;
            Double min = RNGUtil.getSqrtValue(userRating - 500, maxReward);
            Double max = RNGUtil.getSqrtValue(userRating+500, maxReward);

            elementalStatBonus =
                    ElementalStatBonus.GenerateRandomElementalStatBonusWithRandomElement(min, max, type); //wowza


        } else{
            elementalStatBonus =
                    ElementalStatBonus.GenerateRandomElementalStatBonusWithRandomElement(0, 0, "none"); //wowza
        }
        elementalStatBonusArrayList.add(elementalStatBonus);
        card.setElementalStatBonusList(elementalStatBonusArrayList);

        //Every card should have some sort of bonus that is given to the card.
        //To start, let's start with a single bonus, to the stat of the type of card that is being created.
        Double maxReward = 50.0; //I guess just +50% for now is fine I dunno
        Double min = RNGUtil.getSqrtValue(userRating-500, maxReward);
        Double max = RNGUtil.getSqrtValue(userRating+500, maxReward);

        StatBonus statBonus = StatBonus.GenerateRandomStatBonus(min, max, type);
        if(statBonus == null){return null;}

        ArrayList<StatBonus> statBonusList = new ArrayList<>();
        statBonusList.add(statBonus);

        //Add the stat bonus list to the card.
        card.setStatBonusList(statBonusList);

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

    public List<StatBonus> getStatBonusList() {
        return statBonusList;
    }

    public void setStatBonusList(List<StatBonus> statBonusList) {
        this.statBonusList = statBonusList;
    }

    public List<ElementalStatBonus> getElementalStatBonusList() {
        return elementalStatBonusList;
    }

    public void setElementalStatBonusList(List<ElementalStatBonus> elementalStatBonusList) {
        this.elementalStatBonusList = elementalStatBonusList;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }


    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();

        stringBuilder.append("[")
                .append(this.name)
                .append(", ")
                .append(statBonusList)
                .append(", ")
                .append(elementalStatBonusList)
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
        for (StatBonus bonus : card.getStatBonusList()){
            bonusTotal += (int)bonus.getBonus();
        }
        for (ElementalStatBonus bonus : card.getElementalStatBonusList()){
            bonusTotal += (int)bonus.getBonus();
        }

        //(value/50)^4 is the value of the card, rounded to nearest integer.
        //Subject to change.
        double val = Math.pow((double)bonusTotal/50, 4);

        return (int)Math.round(val);
    }

}
