package Utilities;

import Models.Card;
import Models.Equipment;

import java.util.List;

/**
 * @author FrancescosMac
 * @date 17-02-21.
 */
public class InventoryUtil {

    private List<Card> cards;
    private List<Equipment> equipment;

    public InventoryUtil(List<Card> cards, List<Equipment> equipment) {
        this.cards = cards;
        this.equipment = equipment;
    }

    public List<Card> getCards() {
        return cards;
    }

    public void setCards(List<Card> cards) {
        this.cards = cards;
    }

    public List<Equipment> getEquipment() {
        return equipment;
    }

    public void setEquipment(List<Equipment> equipment) {
        this.equipment = equipment;
    }
}
