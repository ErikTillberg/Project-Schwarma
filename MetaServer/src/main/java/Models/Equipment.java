package Models;


import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Id;

import java.util.ArrayList;
import java.util.List;


/**
 * @author FrancescosMac
 * @date 17-02-16.
 */
public class Equipment {

    @Id
    private ObjectId id;

    private String name;

    // Equipment can be either boots, weapons, or shield.
    private String type;
    private List<StatBonus> statBonusList = new ArrayList<StatBonus>();
    private List<ElementalStatBonus> elementalStatBonusList = new ArrayList<ElementalStatBonus>();


    public Equipment(){ super(); }

    public Equipment(String name, String type, List<StatBonus> statBonusList,
                     List<ElementalStatBonus> elementalStatBonusList){
        this.name = name;
        this.type = type;
        this.statBonusList = statBonusList;
        this.elementalStatBonusList = elementalStatBonusList;
    }


    ///////////////////////
    /////GETTER&SETTER/////
    ///////////////////////

    public ObjectId getId() { return id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getType() { return type; }

    public void setType(String type) { this.type = type; }

    public List<StatBonus> getStatBonusList() { return statBonusList; }

    public void setStatBonusList(List<StatBonus> statBonusList) { this.statBonusList = statBonusList; }

    public List<ElementalStatBonus> getElementalStatBonusList() { return elementalStatBonusList; }

    public void setElementalStatBonusList(List<ElementalStatBonus> elementalStatBonusList)
    { this.elementalStatBonusList = elementalStatBonusList;}


    ///////////////////////
    ////////EQUALS ////////
    ///////////////////////

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Equipment equipment = (Equipment) o;

        if (name != null ? !name.equals(equipment.name) : equipment.name != null) return false;
        if (type != null ? !type.equals(equipment.type) : equipment.type != null) return false;
        if (statBonusList != null ? !statBonusList.equals(equipment.statBonusList) : equipment.statBonusList != null)
            return false;
        return !(elementalStatBonusList != null ? !elementalStatBonusList.equals(equipment.elementalStatBonusList) : equipment.elementalStatBonusList != null);

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
     * This method constructs and returns a random gear item based on the rating that is sent to it
     * @param userRating the rating of the user
     * @param type the type of gear to construct
     * @return a randomized gear item
     */
    public static Equipment GenerateEquipment(int userRating, String type){
        //TODO implement this
        return null;
    }
}
