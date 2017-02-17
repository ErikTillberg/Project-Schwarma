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


    ///////////////////////
    ////////EQUALS ////////
    ///////////////////////

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Card card = (Card) o;

        if (name != null ? !name.equals(card.name) : card.name != null) return false;
        if (type != null ? !type.equals(card.type) : card.type != null) return false;
        if (statBonusList != null ? !statBonusList.equals(card.statBonusList) : card.statBonusList != null)
            return false;
        return !(elementalStatBonusList != null ? !elementalStatBonusList.equals(card.elementalStatBonusList) : card.elementalStatBonusList != null);

    }

    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (statBonusList != null ? statBonusList.hashCode() : 0);
        result = 31 * result + (elementalStatBonusList != null ? elementalStatBonusList.hashCode() : 0);
        return result;
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
