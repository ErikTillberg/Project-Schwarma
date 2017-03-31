package Main;

import java.util.HashMap;
import java.util.Map;

/**
 * @author FrancescosMac
 * @date 17-03-30.
 */
public class Constants {

    public static Map<String, Integer> int_constants = new HashMap<>();

    // Class multipliers
    protected Constants(){

        int_constants.put("warrior_attack_multiplier", 10);
        int_constants.put("warrior_defence_multiplier", 1);
        int_constants.put("warrior_mobility_multiplier", 1);

        int_constants.put("mage_attack_multiplier", 10);
        int_constants.put("mage_defence_multiplier", 1);
        int_constants.put("mage_mobility_multiplier", 1);

        int_constants.put("thief_attack_multiplier", 10);
        int_constants.put("thief_defence_multiplier", 1);
        int_constants.put("thief_mobility_multiplier", 1);

        int_constants.put("max_player_health", 100);
        int_constants.put("initial_player_rating", 100);

        int_constants.put("rating_range", 500);

        int_constants.put("initial_inventory_size", 9);
    }




}
