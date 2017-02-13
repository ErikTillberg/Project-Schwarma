package Utilities;

/**
 * Created by Erik_Tillberg on 2/3/2017.
 */

/**
 * A simple helper class used to convert any error messages that may occur.
 * Taken from https://dzone.com/articles/building-simple-restful-api
 */
public class ResponseError {

    private String message;
    public ResponseError(String message, String... args){
        this.message = String.format(message, args);
    }
    public ResponseError(Exception e){
        this.message = e.getMessage();
    }

    public String getMessage(){
        return this.message;
    }

}
