package Models;

import jdk.nashorn.internal.ir.annotations.Reference;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;

import jdk.nashorn.internal.ir.annotations.Reference;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Property;

import java.util.List;

/**
 * Created by Erik Tillberg on 2/1/2017.
 */

@Entity()
public class Card {

    @Id
    private ObjectId id;

    //the name of the card
    private String name;

    //the type of the card, can be either 'attack', 'defense', 'mobility'
    private String type;

    private List<StatBonus> statBonusList;

    private List<ElementalStatBonus> elementalStatBonusList;

    //You need the default constructor specific for morphia for some reason
    public Card(){
        super();
    }

    public Card(String name, String type, List<StatBonus> statBonusList, List<ElementalStatBonus> elementalStatBonusList){
        this.name = name;
        this.type = type;
        this.statBonusList = statBonusList;
        this.elementalStatBonusList = elementalStatBonusList;
    }


    /**
     * This method constructs and returns a random card based on the rating that is sent to it
     * @param userRating the rating of the user
     * @param type the type of card to construct
     * @return a randomized card
     */
    public static Card GenerateCard(int userRating, String type){
        //TODO implement this
        return null;
    }

}
