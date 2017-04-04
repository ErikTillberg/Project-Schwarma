package Models;


import Main.Constants;
import Resources.StringLists;
import Utilities.RNGUtil;
import com.google.gson.JsonObject;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Id;

import java.util.ArrayList;
import java.util.List;


/**
 * @author FrancescosMac
 * @date 17-02-16.
 */
public class Equipment {

    public static String SHIELD = "shield";
    public static String WEAPON = "weapon";
    public static String BOOTS = "boots";
    public static String ATTACK = "attack";
    public static String DEFENSE = "defense";

    @Id
    private ObjectId id;

    private String name;
    private Integer value;

    // Equipment can be either boots, weapons, or shield.
    private String type;
    private StatBonus statBonus;
    private ElementalStatBonus elementalStatBonus;


    public Equipment(){ super(); }

    public Equipment(String name, String type, StatBonus statBonus, ElementalStatBonus elementalStatBonus){
        this.name = name;
        this.type = type;
        this.statBonus = statBonus;
        this.elementalStatBonus = elementalStatBonus;
    }


    ///////////////////////
    /////GETTER&SETTER/////
    ///////////////////////

    public ObjectId getId() { return id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getType() { return type; }

    public void setType(String type) { this.type = type; }

    public StatBonus getStatBonus() { return statBonus; }

    public void setStatBonus(StatBonus statBonus) { this.statBonus= statBonus; }

    public ElementalStatBonus getElementalStatBonus() { return elementalStatBonus; }

    public void setElementalStatBonus(ElementalStatBonus elementalStatBonus)
    { this.elementalStatBonus = elementalStatBonus;}

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    ///////////////////////
    ////////EQUALS ////////
    ///////////////////////


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Equipment equipment = (Equipment) o;

        if (id != null ? !id.equals(equipment.id) : equipment.id != null) return false;
        if (name != null ? !name.equals(equipment.name) : equipment.name != null) return false;
        if (value != null ? !value.equals(equipment.value) : equipment.value != null) return false;
        if (type != null ? !type.equals(equipment.type) : equipment.type != null) return false;
        if (statBonus != null ? !statBonus.equals(equipment.statBonus) : equipment.statBonus != null) return false;
        return !(elementalStatBonus != null ? !elementalStatBonus.equals(equipment.elementalStatBonus) : equipment.elementalStatBonus != null);

    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (value != null ? value.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (statBonus != null ? statBonus.hashCode() : 0);
        result = 31 * result + (elementalStatBonus != null ? elementalStatBonus.hashCode() : 0);
        return result;
    }

    /**
     * This method constructs and returns a random card based on the rating that is sent to it
     * @param userRating the rating of the user
     * @param slot the body slot the equipment is meant for
     * @return a randomized card
     */
    public static Equipment GenerateEquipment(int userRating, String slot){
        String slot_bonus;
        Equipment aGear = new Equipment();
        int rating_range = Constants.int_constants.get("rating_range");

        if (Equipment.isValidEquipmentType(slot)){
            aGear.setType(slot);
        } else { return null; } //If it's not a valid type return null.

        switch (slot){
            case "boots":
                slot_bonus = "mobility";
                break;

            case "weapon":
                slot_bonus = "attack";
                break;

            case "shield":
                slot_bonus = "defense";
                break;

            default:
                return null;
        }



        //Decide whether or not an item should have elemental stats:
        //First get the chance of getting an elemental stat:
        //Here the maximum reward is 1.0 or 100% at the maximum reward.
        Double chanceofElementalStat = RNGUtil.getSqrtValueInRange(userRating, 1.0);
        Boolean getsElementalStats = RNGUtil.getRandomBoolean(chanceofElementalStat);
        if(getsElementalStats){
            //Then the Equipment should:
            //a. Decide how many elemental stats are to be generated
            //b. Build that number of random elemental stats and add them to the equipment

            //FOR NOW LETS JUST ADD ONE ELEMENTAL STAT FOR FUN
            //IT WILL HAVE A RANDOM ELEMENT TYPE AND BE OF THE STAT TYPE OF THE CARD
            Double maxReward = 5.0;
            Double min = RNGUtil.getSqrtValue(userRating - rating_range, maxReward);
            Double max = RNGUtil.getSqrtValue(userRating + rating_range, maxReward);

            aGear.setElementalStatBonus(
                    ElementalStatBonus.GenerateRandomElementalStatBonusWithRandomElement(min, max, slot_bonus));
        } else{
            aGear.setElementalStatBonus(ElementalStatBonus.GenerateRandomElementalStatBonusWithRandomElement(0, 0, slot_bonus)); //wowza
        }

        //Every equipment piece should have some sort of bonus that is given to the equipment.
        //To start, let's start with a single bonus, to the stat of the type of equipment that is being created.
        Double maxReward = 10.0; //I guess just +50% for now is fine I dunno
        Double min = RNGUtil.getSqrtValue(userRating - rating_range, maxReward);
        Double max = RNGUtil.getSqrtValue(userRating + rating_range, maxReward);

        StatBonus statBonus = StatBonus.GenerateRandomStatBonus(min, max, slot_bonus);
        if(statBonus == null){return null;}

        //Add the stat bonus list to the equipment.
        aGear.setStatBonus(statBonus);

        //Last thing to do is add the name of the equipment. Let's do this by getting random strings from lists.
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(slot).append(" card of ").append(StringLists.getRandomCardAdjective()).append(" ").append(StringLists.getRandomCardNoun());

        String name = stringBuilder.toString();
        aGear.setName(name);

        //Set the value of the equipment:

        aGear.setValue(Equipment.getEquipmentValue(aGear));

        //I think that's everything!!!

        return aGear;
    }


    public static boolean isValidEquipmentType(String type){
        return type.equals(Equipment.SHIELD) || type.equals(Equipment.WEAPON) || type.equals(Equipment.BOOTS);
    }

    public static String getRandomEquipmentType(){
        double rand = Math.random();

        if (rand < 0.33){
            return Equipment.BOOTS;
        }
        if (rand >= 0.33 && rand < 0.66){
            return Equipment.WEAPON;
        }
        if (rand >= 0.66){
            return Equipment.SHIELD;
        }
        return Equipment.BOOTS; //Default, should never get here.
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();

        stringBuilder.append("[")
                .append(this.name)
                .append(", ")
                .append(type)
                .append(", ")
                .append(statBonus)
                .append(", ")
                .append(elementalStatBonus)
                .append("]");

        return stringBuilder.toString();
    }

    /**
     * Presently identical to that in the card value generator.
     * @param equipment
     * @return
     */
    private static Integer getEquipmentValue(Equipment equipment){

        //For now let's just look at the cards stats and tally their values:
        int bonusTotal = 0;
        bonusTotal += (int)equipment.getStatBonus().getBonus();
        bonusTotal += (int)equipment.getElementalStatBonus().getBonus();


        //(value/50)^4 is the value of the card, rounded to nearest integer.
        //Subject to change.
        double val = Math.pow((double)bonusTotal/50, 4);

        return (int)Math.round(val);
    }
}
