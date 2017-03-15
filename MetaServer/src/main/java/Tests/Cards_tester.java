package Tests;

import Models.Card;
import Models.Trigger;

/**
 * @author FrancescosMac
 * @date 17-03-11.
 */
public class Cards_tester {
    public static void main(String[] args) {

        Card new_card = Card.GenerateCard(1000, "attack");
        System.out.println(new_card);
        System.out.println(Card.simplifyCardForBattle(new_card));

        new_card.getTrigger().setLhs("test");
        new_card.getTrigger().setRhs("test3");
        new_card.getTrigger().setOperator(">");

        System.out.println(new_card.getTrigger().simplifyForBattle());

    }
}
