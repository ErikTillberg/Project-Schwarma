package Models;

import com.google.gson.JsonObject;

/**
 * @author FrancescosMac
 * @date 17-03-12.
 */
public class Trigger {

    private String lhs = null;
    private String rhs = null;
    private String operator = null;

    public Trigger(){}

    public String getLhs() {
        return lhs;
    }

    public void setLhs(String lhs) {
        this.lhs = lhs;
    }

    public String getRhs() {
        return rhs;
    }

    public void setRhs(String rhs) {
        this.rhs = rhs;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public JsonObject simplifyForBattle(){

        JsonObject trigger_info = new JsonObject();
        trigger_info.addProperty("lhs", this.getLhs());
        trigger_info.addProperty("operator", this.getOperator());
        trigger_info.addProperty("rhs", this.getRhs());

        return trigger_info;
    }
}
