import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Property;

/**
 * Created by Erik Tillberg on 1/26/2017.
 */

@Entity()
public class Employee {

    @Id
    private ObjectId id;
    private String name;

    @Property("wage")
    private Double salary;

    public Employee(String name, Double sal){
        this.name = name;
        this.salary = sal;
    }
}
