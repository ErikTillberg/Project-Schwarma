package Utilities;

/**
 * Created by Erik_Tillberg on 2/6/2017.
 */

/**
 * A simple helper class used to convert any success messages. In normal situations, the object could just be returned
 * Sometimes there are successes where an object won't be returned (e.g. login but the user does not exist is not a 400
 * error, but wouldn't return a User object.
 * Taken from https://dzone.com/articles/building-simple-restful-api
 */
public class ResponseSuccess {

    private String message;
    public ResponseSuccess(String message, String... args){
        this.message = String.format(message, args);
    }
    public ResponseSuccess(Exception e){
        this.message = e.getMessage();
    }

    public String getMessage(){
        return this.message;
    }

}
