package Tests;

/**
 * Created by Erik_Tillberg on 2/3/2017.
 */

import com.google.gson.Gson;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import spark.Spark;
import spark.utils.IOUtils;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.fail;
import static org.junit.Assert.assertEquals;


/**
 * Testing class for AuthenticationTest
 * Calls main method, so you can start the application from here, but the server quits on all the test completions
 */
public class AuthenticationTest {

    @BeforeClass
    public static void beforeClass(){
        Main.Routes.main(null);
    }

    @AfterClass
    public static void afterClass(){
        Spark.stop();
    }

    @Test
    public void userSignup(){
        TestResponse res = request("POST", "/signup?email=test@test.com&username=fleshofmyenemies&password=thisshouldbehashedbeforepost");
        Map<String, String> json = res.json();
        assertEquals(200, res.status);
        assertEquals("fleshofmyenemies", json.get("username"));
        assertNotNull(json.get("id"));
    }

    /**
     *
     * The following two classes have been blatantly stolen from
     * https://github.com/mscharhag/blog-examples/blob/master/sparkdemo/src/test/java/com/mscharhag/sparkdemo/UserControllerIntegrationTest.java
     *
     * @param method either post or get or put or delete
     * @param path the path to the desired route (e.g. signup)
     * @return
     */
    private TestResponse request(String method, String path) {
        try {
            URL url = new URL("http://localhost:9000" + path);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod(method);
            connection.setDoOutput(true);
            connection.connect();
            String body = IOUtils.toString(connection.getInputStream());
            return new TestResponse(connection.getResponseCode(), body);
        } catch (Exception e) {
            e.printStackTrace();
            fail("Sending request failed: " + e.getMessage());
            return null;
        }
    }

    private static class TestResponse {

        public final String body;
        public final int status;

        public TestResponse(int status, String body) {
            this.status = status;
            this.body = body;
        }

        public Map<String,String> json() {
            return new Gson().fromJson(body, HashMap.class);
        }
    }

}
