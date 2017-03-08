package Models;

import com.google.gson.JsonObject;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.query.Query;

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
    private String player1;
    private String player2;
    private Boolean player1_ready = false;
    private Boolean player2_ready = false;
    private Date date;
    private JsonObject battle_json = new JsonObject();
    private JsonObject player1_cards = new JsonObject();
    private JsonObject player2_cards = new JsonObject();
    private List<Equipment> player1_equipment;
    private List<Equipment> player2_equipment;


    public Battle(){}

    public Battle(String player1, String player2, List<Equipment> player1_equipment, List<Equipment> player2_equipment){
        this.player1 = player1;
        this.player2 = player2;
        this.player1_equipment = player1_equipment;
        this.player2_equipment = player2_equipment;
        this.date = new Date();
    }


    ///////////////////////
    /////GETTER&SETTER/////
    ///////////////////////

    public ObjectId getId() { return id; }

    public String getPlayer1() { return player1; }

    public void setPlayer1(String player1) { this.player1 = player1; }

    public String getPlayer2() { return player2; }

    public void setPlayer2(String player2) { this.player2 = player2; }

    public JsonObject getBattle_json() { return battle_json; }

    public Date getDate() { return date; }


    ///////////////////////
    ////////EQUALS ////////
    ///////////////////////

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Battle battle = (Battle) o;

        if (player1 != null ? !player1.equals(battle.player1) : battle.player1 != null) return false;
        if (player2 != null ? !player2.equals(battle.player2) : battle.player2 != null) return false;
        if (date != null ? !date.equals(battle.date) : battle.date != null) return false;
        return !(battle_json != null ? !battle_json.equals(battle.battle_json) : battle.battle_json != null);

    }

    @Override
    public int hashCode() {
        int result = player1 != null ? player1.hashCode() : 0;
        result = 31 * result + (player2 != null ? player2.hashCode() : 0);
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + (battle_json != null ? battle_json.hashCode() : 0);
        return result;
    }

    public static Battle getBattleById(String id){
        ObjectId oi = new ObjectId(id);

        final Query<Battle> query = datastore.createQuery(Battle.class)
                .field("id").equal(oi);

        Battle battle;
        try {
            battle = query.get();
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
        return battle;

    }

    public boolean save(){
        datastore.save(this);
        return true;
    }


}
