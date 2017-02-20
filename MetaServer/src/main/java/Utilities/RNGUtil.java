package Utilities;

import java.util.Random;

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

    public static boolean getRandomBoolean(float chance){
        Random random = new Random();

        return random.nextFloat() < chance;
    }


}
