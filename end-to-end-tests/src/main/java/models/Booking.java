package models;

public class Booking {

    private String firstname;
    private String lastname;
    private String totalPrice;

    public Booking(String firstname, String lastname, String totalPrice) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.totalPrice = totalPrice;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public String getTotalPrice() {
        return totalPrice;
    }
}
