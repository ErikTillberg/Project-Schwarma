package Utilities;

/**
 * Created by Erik Tillberg on 2/21/2017.
 */
public class WebSocketMessage {

    private String type;
    private String message;

    public WebSocketMessage(String type, String message, String... args){
        this.type = type;
        this.message = String.format(message, args);
    }

    public WebSocketMessage(Exception e){
        this.message = e.getMessage();
    }

    public String getMessage(){
        return this.message;
    }

    public String getType(){ return this.type; }

}

