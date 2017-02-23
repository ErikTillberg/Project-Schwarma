package Models;


import Resources.StringLists;
import Utilities.RNGUtil;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Id;

import java.util.ArrayList;
import java.util.List;


/**
 * @author FrancescosMac
 * @date 17-02-16.
 */
public class Equipment {

    public static String HEAD = "head";
    public static String WEAPON = "weapon";
    public static String OFFHAND = "offhand";
    public static String ATTACK = "attack";
    public static String DEFENSE = "defense";

    @Id
    private ObjectId id;

    private String name;

    // Equipment can be either boots, weapons, or shield.
    private String type;
    private List<StatBonus> statBonusList = new ArrayList<StatBonus>();
    private List<ElementalStatBonus> elementalStatBonusList = new ArrayList<ElementalStatBonus>();


    public Equipment(){ super(); }

    public Equipment(String name, String type, List<StatBonus> statBonusList,
                     List<ElementalStatBonus> elementalStatBonusList){
        this.name = name;
        this.type = type;
        this.statBonusList = statBonusList;
        this.elementalStatBonusList = elementalStatBonusList;
    }


    ///////////////////////
    /////GETTER&SETTER/////
    ///////////////////////

    public ObjectId getId() { return id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getType() { return type; }

    public void setType(String type) { this.type = type; }

    public List<StatBonus> getStatBonusList() { return statBonusList; }

    public void setStatBonusList(List<StatBonus> statBonusList) { this.statBonusList = statBonusList; }

    public List<ElementalStatBonus> getElementalStatBonusList() { return elementalStatBonusList; }

    public void setElementalStatBonusList(List<ElementalStatBonus> elementalStatBonusList)
    { this.elementalStatBonusList = elementalStatBonusList;}


    ///////////////////////
    ////////EQUALS ////////
    ///////////////////////

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Equipment equipment = (Equipment) o;

        if (name != null ? !name.equals(equipment.name) : equipment.name != null) return false;
        if (type != null ? !type.equals(equipment.type) : equipment.type != null) return false;
        if (statBonusList != null ? !statBonusList.equals(equipment.statBonusList) : equipment.statBonusList != null)
            return false;
        return !(elementalStatBonusList != null ? !elementalStatBonusList.equals(equipment.elementalStatBonusList) : equipment.elementalStatBonusList != null);

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
     * @param slot the body slot the equipment is meant for
     * @return a randomized card
     */
    public static Equipment GenerateEquipment(int userRating, String slot){
        String slot_bonus;
        Equipment aGear = new Equipment();

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
            Double maxReward = 50.0;
            Double min = RNGUtil.getSqrtValue(userRating-500, maxReward);
            Double max = RNGUtil.getSqrtValue(userRating+500, maxReward);

            ElementalStatBonus elementalStatBonus =
                    ElementalStatBonus.GenerateRandomElementalStatBonusWithRandomElement(min, max, slot_bonus); //wowza

            ArrayList<ElementalStatBonus> elementalStatBonusArrayList = new ArrayList<>();

            elementalStatBonusArrayList.add(elementalStatBonus);

            aGear.setElementalStatBonusList(elementalStatBonusArrayList);
        } //else there is nothing, just don't add the stats

        //Every equipment piece should have some sort of bonus that is given to the equipment.
        //To start, let's start with a single bonus, to the stat of the type of equipment that is being created.
        Double maxReward = 50.0; //I guess just +50% for now is fine I dunno
        Double min = RNGUtil.getSqrtValue(userRating-500, maxReward);
        Double max = RNGUtil.getSqrtValue(userRating+500, maxReward);

        StatBonus statBonus = StatBonus.GenerateRandomStatBonus(min, max, slot_bonus);
        if(statBonus == null){return null;}

        ArrayList<StatBonus> statBonusList = new ArrayList<>();
        statBonusList.add(statBonus);

        //Add the stat bonus list to the card.
        aGear.setStatBonusList(statBonusList);

        //Last thing to do is add the name of the card. Let's do this by getting random strings from lists.
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(slot_bonus).append(" card of ").append(StringLists.getRandomCardAdjective()).append(" ").append(StringLists.getRandomCardNoun());

        String name = stringBuilder.toString();
        aGear.setName(name);

        //I think that's everything!!!

        return aGear;
    }


    public static boolean isValidEquipmentType(String type){
        return type.equals(Equipment.HEAD) || type.equals(Equipment.WEAPON) || type.equals(Equipment.OFFHAND);
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
}
