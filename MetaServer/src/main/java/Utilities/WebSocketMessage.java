package Utilities;

/**
 * Created by Erik Tillberg on 2/21/2017.
 */
public class WebSocketMessage {

    private String type;
    private Object message;

    public WebSocketMessage(String type, Object message){
        this.type = type;
        this.message = message;
    }

    public WebSocketMessage(Exception e){
        this.message = e.getMessage();
    }

    public Object getMessage(){
        return this.message;
    }

    public String getType(){ return this.type; }

}

