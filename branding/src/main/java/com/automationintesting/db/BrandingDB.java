package com.automationintesting.db;

import com.automationintesting.model.Branding;
import com.automationintesting.model.Contact;
import com.automationintesting.model.Map;
import org.h2.jdbcx.JdbcDataSource;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Component
public class BrandingDB {

    private Connection connection;
    private final String SELECT_ALL_BRANDINGS = "SELECT * FROM PUBLIC.brandings";

    public BrandingDB() throws SQLException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        // If you would like to access the DB for this API locally. Uncomment the line below and
        // use a SQL client to access jdbc:h2:tcp://localhost:9092/mem:rbp
        // Server.createTcpServer("-tcpPort", "9092", "-tcpAllowOthers").start();
    }

    public Branding update(Branding branding) throws SQLException {
        UpdateSql updateSql = new UpdateSql(connection, branding);
        PreparedStatement updatePs = updateSql.getPreparedStatement();

        if (updatePs.executeUpdate() > 0) {
            PreparedStatement ps = connection.prepareStatement("SELECT * FROM PUBLIC.brandings WHERE brandingid = 1");

            ResultSet result = ps.executeQuery();
            result.next();

            return new Branding(result);
        } else {
            return null;
        }
    }

    public Branding queryBranding() throws SQLException {
        List<Branding> brandings = new ArrayList<>();

        PreparedStatement ps = connection.prepareStatement(SELECT_ALL_BRANDINGS);

        ResultSet results = ps.executeQuery();
        while(results.next()) {
            brandings.add(new Branding(results));
        }

        Branding branding;

        if (brandings.isEmpty()) {
            branding = new Branding();
        } else {
            branding = brandings.get(0);
        }

        return branding;
    }

    public void resetDB() throws SQLException {
        update(defaultBranding());
    }

    private Branding defaultBranding() {
        return new Branding(
                "Shady Meadows B&B",
                new Map(52.6351204, 1.2733774),
                "https://www.mwtestconsultancy.co.uk/img/rbp-logo.png",
                "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.",
                new Contact("Shady Meadows B&B", "The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S", "012345678901", "fake@fakeemail.com")
        );
    }
}
