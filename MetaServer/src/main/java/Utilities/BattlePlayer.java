package Utilities;

import Models.Card;
import Models.ElementalStatBonus;
import Models.Equipment;
import Models.StatBonus;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jdk.nashorn.api.scripting.JSObject;
import org.bson.types.ObjectId;

import java.util.List;

/**
 * @author FrancescosMac
 * @date 17-03-10.
 */
public class BattlePlayer {

    private String player_name;

    private int attack_bonus = 0;
    private int resistance_to_damage = 0;
    private int resistance_to_fire = 0;
    private int resistance_to_ice = 0;
    private int resistance_to_earth = 0;
    private int movement_speed = 0;

    JsonObject player, triggers, base_stats, action_percentages;
    JsonArray move, attack, defense, cards;


    public BattlePlayer(){}

    public BattlePlayer(String player_name, List <Equipment> equipment) {
        this.player_name = player_name;
        processPlayerEquipment(equipment);
    }

    // Extract resistance information from equipment passive bonuses, and add weapon and off hand as cards
    private void processPlayerEquipment(List <Equipment> equipment){
        String type, element;

        for (Equipment item : equipment){
            type = item.getType();
            switch (type){
                case("weapon"): this.attack_bonus += item.getStatBonus().getBonus();
                    break;

                case("shield"): this.resistance_to_damage += item.getStatBonus().getBonus();
                    break;

                case("boots"): this.movement_speed += item.getStatBonus().getBonus();
                    break;
            }

            element = item.getElementalStatBonus().getElement();
            switch (element){
                case("fire"): this.resistance_to_fire += item.getElementalStatBonus().getBonus();
                    break;

                case("water"): this.resistance_to_ice += item.getElementalStatBonus().getBonus();
                    break;

                case("earth"): this.resistance_to_earth += item.getElementalStatBonus().getBonus();
                    break;

            }

        }
    }

    public void prepareForBattle(String player_name, String att_attribute,
                                 String def_attribute, String mov_attribute,
                                 List <Card> player_cards){

        String card_type;

        base_stats = new JsonObject();
        base_stats.addProperty("health", 100);
        base_stats.addProperty("damage", 0);
        base_stats.addProperty("attackBonus", attack_bonus);
        base_stats.addProperty("movementSpeed", movement_speed);
        base_stats.addProperty("resistanceToDamage", resistance_to_damage);
        base_stats.addProperty("resistanceToFire", resistance_to_fire);
        base_stats.addProperty("resistanceToIce", resistance_to_ice);
        base_stats.addProperty("resistanceToEarth", resistance_to_earth);


        action_percentages = new JsonObject();
        action_percentages.addProperty("attack", att_attribute);
        action_percentages.addProperty("defense", def_attribute);
        action_percentages.addProperty("move", mov_attribute);

        move    = new JsonArray();
        attack  = new JsonArray();
        defense = new JsonArray();

        cards = new JsonArray();
        for (Card card : player_cards) {
            cards.add(Card.simplifyCardForBattle(card));

            card_type = card.getType();
            switch (card_type){
                case "attack": attack.add(Card.simplifyTriggerForBattle(card));
                    break;

                case "defense": defense.add(Card.simplifyTriggerForBattle(card));
                    break;

                case "mobility": move.add(Card.simplifyTriggerForBattle(card));
                    break;

            }

        }

        triggers  = new JsonObject();
        triggers.add("triggers", attack);
        triggers.add("triggers", defense);
        triggers.add("triggers", move);

        player = new JsonObject();
        player.addProperty("player_name", player_name);
        player.add("baseStats", base_stats);
        player.add("actionPercentages", action_percentages);
        player.add("cards", cards);
        player.add("triggers", triggers);

    }
}
