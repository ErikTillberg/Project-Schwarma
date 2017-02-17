package Models;

import javax.lang.model.element.Element;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Created by Erik Tillberg on 2/16/2017.
 */
public class ElementalStatBonus extends StatBonus {

    public static String WATER = "water";
    public static String EARTH = "earth";
    public static String FIRE = "fire";

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

        double randomBonusNumber = ThreadLocalRandom.current().nextDouble(min, max);
        esb.setBonus(randomBonusNumber);

        if (ElementalStatBonus.isValidElement(element)){
            esb.setElement(element);
        } else {
            System.out.println("Could not create stat bonus with element " +  element + ", defaulting to fire");
            esb.setElement(ElementalStatBonus.FIRE);
        }

        if (ElementalStatBonus.isValidElementalStat(statType)){
            esb.setElement(statType);
        } else {
            System.out.println("Could not create elemental stat bonus of type " + statType + ", defaulting to attack");
            esb.setStat(StatBonus.ATTACK);
        }

        return esb;

    }

    public static boolean isValidElementalStat(String statType) {
        return statType == "attack" || statType == "defense";
    }

    public static boolean isValidElement(String element)        {
        return element == ElementalStatBonus.WATER || element == ElementalStatBonus.EARTH || element == ElementalStatBonus.FIRE;
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


}
