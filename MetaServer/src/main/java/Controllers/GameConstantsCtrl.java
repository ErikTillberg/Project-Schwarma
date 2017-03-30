package Controllers;

import Main.Constants;

import java.util.Map;

/**
 * @author FrancescosMac
 * @date 17-03-30.
 */
public class GameConstantsCtrl {

    public static Object updateConstants(Map <String, String> new_constants){

        for (Map.Entry<String, String> entry : new_constants.entrySet())
            Constants.int_constants.put(entry.getKey(), Integer.parseInt(entry.getValue()));


        return true;
    }
}
