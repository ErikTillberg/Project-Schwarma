package Models;

import Utilities.RNGUtil;

import javax.lang.model.element.Element;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Created by Erik Tillberg on 2/16/2017.
 */
public class ElementalStatBonus extends StatBonus {

    public static String WATER = "water";
    public static String EARTH = "earth";
    public static String FIRE = "fire";
    public static String NONE = "none";

    //The type of element, either water fire or earth (probably, hard to say since everyone keeps calling water ice and I don't know what's going on anymore)
    private String element;

    public ElementalStatBonus(){
        super();
    }

    public ElementalStatBonus(double statBonus, String statType, String element){
        super();
        this.setBonus(statBonus);
        if (ElementalStatBonus.isValidElementalStat(statType)){
            this.setStat(statType);
        } else {
            System.out.println("Could not create elemental stat of type " + statBonus + ", defaulting to attack");
            this.setStat("attack");
        }

        if (ElementalStatBonus.isValidElement(element)){
            this.element = element;
        }

    }

    public static ElementalStatBonus GenerateRandomElementalStatBonus(double min, double max, String element, String statType){

        ElementalStatBonus esb = new ElementalStatBonus();

        double randomBonusNumber = (max>0)? ThreadLocalRandom.current().nextDouble(min, max):0;
        esb.setBonus(randomBonusNumber);

        if (ElementalStatBonus.isValidElement(element)){
            esb.setElement(element);
        } else {
            System.out.println("Could not create stat bonus with element " +  element + ", defaulting to fire");
            esb.setElement(ElementalStatBonus.FIRE);
        }

        if (ElementalStatBonus.isValidElementalStat(statType)){
            esb.setStat(statType);
        } else {
            System.out.println("Could not create elemental stat bonus of type " + statType + ", defaulting to attack");
            esb.setStat(StatBonus.ATTACK);
        }

        return esb;

    }

    public static ElementalStatBonus GenerateRandomElementalStatBonusWithRandomElement(double min, double max, String statType){
        if (statType == "none")
            return ElementalStatBonus.GenerateRandomElementalStatBonus(min, max, "none", statType);

        else {
            String element = getRandomElement();
            return ElementalStatBonus.GenerateRandomElementalStatBonus(min, max, element, statType);
        }
    }

    public static boolean isValidElementalStat(String statType) {
        return statType == "attack" || statType == "defense" || statType == "none";
    }

    public static boolean isValidElement(String element)        {
        return  element == ElementalStatBonus.WATER ||
                element == ElementalStatBonus.EARTH ||
                element == ElementalStatBonus.FIRE ||
                element == ElementalStatBonus.NONE;
    }

    public static String getRandomElement(){
        Integer elementToChoose = RNGUtil.getRandomInteger(0, 3);

        switch(elementToChoose){
            case 0:
                return ElementalStatBonus.FIRE;
            case 1:
                return ElementalStatBonus.WATER;
            case 2:
                return ElementalStatBonus.EARTH;
            default:
                return null;
        }

    }

    //////////////////////////////////////////
    ///////////GETTER AND SETTERS/////////////
    //////////////////////////////////////////

    public String getElement() {
        return element;
    }

    public void setElement(String element) {
        this.element = element;
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();

        stringBuilder.append("[")
                .append(this.getStat())
                .append(", ")
                .append(this.element)
                .append(", ")
                .append(this.getBonus())
                .append("]");
        return stringBuilder.toString();
    }
}
