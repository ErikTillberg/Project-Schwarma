package Models;

import Main.Constants;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.query.Query;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static Utilities.DBConn.datastore;


/**
 * @author FrancescosMac
 * @date 17-02-16.
 */
@Entity()
public class Battle {

    @Id
    private ObjectId id;

    //User IDs
    private String player1_username;
    private String player2_username;
    private Boolean player1_ready;
    private Boolean player2_ready;
    private Date date;


    public Battle(){super ();}

    public Battle(String player1, String player2){
        this.date = new Date();
        this.player1_username = player1;
        this.player2_username = player2;
        this.player1_ready = false;
        this.player2_ready = false;
    }


    ///////////////////////
    /////GETTER&SETTER/////
    ///////////////////////

    public ObjectId getId() { return id; }

    public String getPlayer1_username() {
        return player1_username;
    }

    public void setPlayer1_username(String player1_username) {
        this.player1_username = player1_username;
    }

    public String getPlayer2_username() {
        return player2_username;
    }

    public void setPlayer2_username(String player2_username) {
        this.player2_username = player2_username;
    }

    public Boolean getPlayer1_ready(){return player1_ready;}

    public void setPlayer1_ready(Boolean state){ this.player1_ready = state;}

    public Boolean getPlayer2_ready(){return player2_ready;}

    public void setPlayer2_ready(Boolean state){ this.player2_ready = state;}

    public Date getDate() { return date; }


    public static String prepareForSimulation(String battle_id){

        JsonObject battle_info = new JsonObject();
        JsonArray players_array = new JsonArray();

        final Query<Battle> battle_query = datastore.createQuery(Battle.class).field("id").equal(new ObjectId(battle_id));

        Battle battle = null;
        try{
            battle = battle_query.get();
        }catch (Exception e){
            return "prepareForSimulation could not retrieve the battle: " +e;
        }


        JsonObject player1_processed = processPlayer(battle.getPlayer1_username());
        JsonObject player2_processed = processPlayer(battle.getPlayer2_username());

        players_array.add(player1_processed);
        players_array.add(player2_processed);

        battle_info.addProperty("battle_id", battle_id);
        battle_info.add("players", players_array);


        return battle_info.toString();
    }


    private static JsonObject processPlayer(String player_username){

        JsonObject player_json, triggers, base_stats, action_percentages;
        JsonArray move, attack, defense, cards;
        String card_type;

        final Query<User> player_query = datastore.createQuery(User.class).field("username").equal(player_username);

        User player = null;
        try{
            player = player_query.get();
        }catch (Exception e){
            System.out.println(e);
        }


        base_stats = new JsonObject();
        base_stats.addProperty("health", Constants.int_constants.get("max_player_health"));
        base_stats.addProperty("damage", 0);

        /**
         * player stats organization is as follows:
         *  {attack_bonus, movement_speed, resistance_to_damage,
         *  resistance_to_fire, resistance_to_ice, resistance_to_earth}
         */

        ArrayList<Equipment> equippedEquipment = new ArrayList<>();

        equippedEquipment.add(player.getEquippedBoots());
        equippedEquipment.add(player.getEquippedWeapon());
        equippedEquipment.add(player.getEquippedChest());

        int [] player_stats = Battle.processPlayerEquipment(equippedEquipment);
        base_stats.addProperty("attack_bonus", player_stats[0]);
        base_stats.addProperty("movement_speed", player_stats[1]);
        base_stats.addProperty("resistance_to_damage", player_stats[2]);
        base_stats.addProperty("resistance_to_fire", player_stats[3]);
        base_stats.addProperty("resistance_to_ice", player_stats[4]);
        base_stats.addProperty("resistance_to_earth", player_stats[5]);

        action_percentages = new JsonObject();
        action_percentages.addProperty("attack", player.getAttack_percentage());
        action_percentages.addProperty("defense", player.getDefense_percentage());
        action_percentages.addProperty("move", player.getMobility_percentage());

        move    = new JsonArray();
        attack  = new JsonArray();
        defense = new JsonArray();

        cards = new JsonArray();
        for (Card card : player.getEquippedCards()) {
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
        triggers.add("attack", attack);
        triggers.add("defense", defense);
        triggers.add("move", move);


        player_json = new JsonObject();
        player_json.addProperty("player_name", player.getUsername());
        player_json.add("base_stats", base_stats);
        player_json.add("actionPercentages", action_percentages);
        player_json.add("cards", cards);
        player_json.add("triggers", triggers);

        return player_json;
    }


    private static int [] processPlayerEquipment(List <Equipment> equipment){
        String type, element;
        int attack_bonus = 0;
        int movement_speed = 0;
        int resistance_to_damage = 0;
        int resistance_to_fire = 0;
        int resistance_to_ice = 0;
        int resistance_to_earth = 0;


        for (Equipment item : equipment){
            type = item.getType();
            switch (type){
                case("weapon"): attack_bonus += item.getStatBonus().getBonus();
                    break;

                case("shield"): resistance_to_damage += item.getStatBonus().getBonus();
                    break;

                case("boots"): movement_speed = 1;
                    break;
            }

            element = item.getElementalStatBonus().getElement();
            switch (element){
                case("fire"): resistance_to_fire += item.getElementalStatBonus().getBonus();
                    break;

                case("water"): resistance_to_ice += item.getElementalStatBonus().getBonus();
                    break;

                case("earth"): resistance_to_earth += item.getElementalStatBonus().getBonus();
                    break;

            }

        }
        return new int[]{attack_bonus, movement_speed, resistance_to_damage, resistance_to_fire,
                        resistance_to_ice, resistance_to_earth};
    }

}
