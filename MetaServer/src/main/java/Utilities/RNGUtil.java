package Utilities;

import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

/**
 *
 * Class contains some useful methods for randomness
 *
 * Created by Erik Tillberg on 2/17/2017.
 */
public class RNGUtil {

    /**
     * Method returns true or false based on the float number given (if 0.20 is given, there is a 20% chance of true);
     * @param chance 0 <= chance <= 1 is the chance of the function returning true
     * @return true or false
     */

    public static Integer RANGE_FOR_LOG = 500;

    public static Integer MAX_REWARD_LEVEL = 3000;

    public static boolean getRandomBoolean(double chance){
        Random random = new Random();

        return random.nextDouble() < chance;
    }

    public static Integer getRandomInteger(int min, int max){
        return ThreadLocalRandom.current().nextInt(min, max);
    }

    /**
     * Takes in a value y and value maxReward which is the maximum reward at the maximum reward level (default 3000).
     * returns a new value after passing through a log function, the value passed to the log function is within some range of y
     * the default range is 500.
     * @param y
     * @param maxReward
     * @return
     */
    public static Double getLogValueInRange(int y, Double maxReward){
        //Next two lines define the bounds for a random number generator.
        //If the value sent here plus the range is greater than the maximum reward level, then set the upper bound to the maximum reward level.
        //Do the same but opposite for the bottom value.
        Integer topValue = (y+RANGE_FOR_LOG) > MAX_REWARD_LEVEL? MAX_REWARD_LEVEL : y+RANGE_FOR_LOG;
        Integer bottomValue = (y-RANGE_FOR_LOG) < 0? 0 : y-RANGE_FOR_LOG;

        Random random = new Random();
        Integer newYValue = random.nextInt((topValue - bottomValue) + 1) + bottomValue;

        LogRandom lr = new LogRandom(maxReward);
        return lr.getLogValue((double)y);
    }

    public static Double getLogValue(int y, Double maxReward){
        LogRandom lr = new LogRandom(maxReward);

        int val;
        if (y < 0){val = 0;}
        else if (y > MAX_REWARD_LEVEL){val = MAX_REWARD_LEVEL;}
        else {val = y;}

        return lr.getLogValue((double)val);
    }

    /**
     * Class builds a logarithmic function that maxes out its value at some MAX_REWARD_LEVEL parameter
     */
    private static class LogRandom{



        private Double maxReward;

        /**
         * @param maxReward Max reward in the case of say getting a card with an elemental bonus could be 100%
         */
        public LogRandom(Double maxReward){
            this.maxReward = maxReward;
        }

        /**
         * This uses a log graph to compute a value based on the maxReward and MAX_REWARD_VALUE, it's shifted to have getLogValue(0) = 0.
         * @param y some y value to compute log for
         * @return
         */
        public Double getLogValue(Double y){
            return (this.maxReward/Math.log(MAX_REWARD_LEVEL))*Math.log(y+1);
        }

    }

}
