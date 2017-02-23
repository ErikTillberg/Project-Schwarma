package Models;

import java.util.concurrent.ThreadLocalRandom;

/**
 * Created by Erik Tillberg on 2/16/2017.
 */
public class StatBonus {

    public static String ATTACK = "attack";
    public static String DEFENSE = "defense";
    public static String MOBILITY = "mobility";

    //This is the stat it affects (attack or defense or mobility)
    private String stat;


    //This is the bonus
    private double bonus;

    public StatBonus(){
        super();
    }

    public StatBonus(String stat, double bonus){
        if (StatBonus.isValidStat(stat)) {
            this.stat = stat;
            this.bonus = bonus;
        } else {
            System.out.println("Could not create stat bonus of type " + stat + ", defaulting to attack");
            stat.equals("attack");
        }
    }

    public static boolean isValidStat(String type){
        return type == StatBonus.ATTACK || type == StatBonus.DEFENSE || type == StatBonus.MOBILITY;
    }

    /**
     * Method builds a random stat bonus, with a bonus between double min and double max
     * the type of card is determined.
     * @param min is the minimum stat bonus that will be applied
     * @param max is the maxmimum stat bonus that will be applied
     * @param type is the type of stat that will be affected
     * @return a random stat bonus
     * @throws Exception in the event of something going horribly wrong
     */
    public static StatBonus GenerateRandomStatBonus(double min, double max, String type) {
        StatBonus randomBonus = new StatBonus();

        double randomBonusNumber = ThreadLocalRandom.current().nextDouble(min, max);

        randomBonus.setBonus(randomBonusNumber);
        if (StatBonus.isValidStat(type)){
            randomBonus.setStat(type);
        } else {
            return null;
        }

        return randomBonus;
    }

    /**
     * Method builds a random stat bonus, with a bonus between double min and double max
     * the type of card is random, either attack defense or mobility
     * @param min is the minimum stat bonus that will be applied
     * @param max is the maxmimum stat bonus that will be applied
     * @return a random stat bonus
     * @throws Exception in the event of something going horribly wrong
     */
    public static StatBonus GenerateRandomStatBonus(double min, double max){
        StatBonus randomBonus = new StatBonus();

        double randomBonusNumber = ThreadLocalRandom.current().nextDouble(min, max);
        String randomType;
        int randomInt = ThreadLocalRandom.current().nextInt(0, 3);

        switch (randomInt){
            case 0:
                randomType = StatBonus.ATTACK;
                break;
            case 1:
                randomType = StatBonus.DEFENSE;
                break;
            case 2:
                randomType = StatBonus.MOBILITY;
                break;
            default:
                return null;
        }

        randomBonus.setBonus(randomBonusNumber);
        randomBonus.setStat(randomType);

        return randomBonus;

    }

    //////////////////////////////////////////
    ///////////GETTER AND SETTERS/////////////
    //////////////////////////////////////////
    public String getStat() {
        return stat;
    }

    public void setStat(String stat) {
        this.stat = stat;
    }

    public double getBonus() {
        return bonus;
    }

    public void setBonus(double bonus) {
        this.bonus = bonus;
    }



    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();

        stringBuilder.append("[")
                .append(this.getStat())
                .append(", ")
                .append(this.getBonus())
                .append("]");
        return stringBuilder.toString();
    }
}
