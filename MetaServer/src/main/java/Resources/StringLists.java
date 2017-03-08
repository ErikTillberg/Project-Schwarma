package Resources;

import Utilities.RNGUtil;

/**
 * Created by Erik Tillberg on 2/20/2017.
 */
public class StringLists {

    public static String[] CARD_ADJECTIVES = {
        "", //maybe there is no adjective
            "valiant",
            "great",
            "electric",
            "nuclear",
            "absolute",
            "greater",
            "spiritual",
            "supreme",
            "hilarious",
            "discretionary",
            "dubious",
            "enormous",
            "questionable",
            "extraordinary",
            "untimely",
            "immense",
            "destructive",
            "infinite",
            "limited",
            "not-very-much",
            "kind-of-okay",
            "head-scratching",
            "radical",
            "unprecedented",
            "bifurcating",
            "orwellian",
            "mediocre",
            "tremendous",
            "unusual",
            "miraculous",
            "remarkable",
            "unparalleled",
            "abnormal",
            "anomalous",
            "newfangled",
            "outlandish",
            "idiosyncratic",
            "aberrant",
            "embiggening",
            "cromulent",
            "illegitimate",
            "varying"
    };

    public static String[] CARD_NOUNS = {
        "power",
            "influence",
            "potential",
            "skill",
            "aptitude",
            "competency",
            "efficacy",
            "endowment",
            "potentiality",
            "virtue",
            "doom",
            "calamity",
            "disaster",
            "death",
            "fortune",
            "karma",
            "tragedy",
            "foreordination",
            "cookies",
            "stick in mud",
            "adequacy",
            "potency",
            "efficaciousness",
            "vigor",
            "valor",
            "sufficiency",
            "force",
            "performance",
            "clout",
            "prestige",
            "effect",
            "supremacy",
            "eminence",
            "bulge",
            "greatness",
            "renown",
            "bequest",
            "legacy",
            "apathy",
            "lethargy",
            "impotence",
            "clumsiness",
            "tuck"
        //I could go on forever.
    };

    public static String getRandomCardAdjective(){
        return CARD_ADJECTIVES[RNGUtil.getRandomInteger(0, CARD_ADJECTIVES.length)];
    }

    public static String getRandomCardNoun(){
        return CARD_NOUNS[RNGUtil.getRandomInteger(0, CARD_NOUNS.length)];
    }

}
