package Tests;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

/**
 * @author FrancescosMac
 * @date 17-03-09.
 */
public class testnode {
    public static void main(String[] args) {

        testnode node = new testnode();
        try {
            node.whenPostJsonUsingHttpClient_thenCorrect();
        }catch (Exception e) {
            System.out.println(e);
        }
    }
   public void whenPostJsonUsingHttpClient_thenCorrect()
      throws ClientProtocolException, IOException {
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://localhost:3000");

        String json = "{\"id\":1,\"name\":\"John\"}";
        StringEntity entity = new StringEntity(json);
        httpPost.setEntity(entity);
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-type", "application/json");
        System.out.println(entity);

        CloseableHttpResponse response = client.execute(httpPost);
        System.out.println(response.getStatusLine().getStatusCode());
        String responseBody = EntityUtils.toString(response.getEntity());
        System.out.println(responseBody);
        client.close();
    }

}
