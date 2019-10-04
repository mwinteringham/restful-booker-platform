package com.automationintesting.db;

import com.automationintesting.model.db.Branding;
import liquibase.Contexts;
import liquibase.Liquibase;
import liquibase.database.jvm.JdbcConnection;
import liquibase.exception.LiquibaseException;
import liquibase.resource.FileSystemResourceAccessor;
import liquibase.resource.ResourceAccessor;
import org.h2.jdbcx.JdbcDataSource;
import org.springframework.stereotype.Component;

import java.net.URL;
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

    public void resetDB() throws LiquibaseException {
        JdbcConnection connection = this.getConnection();

        URL resource = getClass().getResource("/db/changelog/");
        ResourceAccessor resourceAccessor = new FileSystemResourceAccessor(resource.getPath());

        Liquibase liquibase = new Liquibase("db.changelog-master.yaml", resourceAccessor, connection);

        liquibase.dropAll();

        liquibase.update(new Contexts());
    }

    private JdbcConnection getConnection() {
        return new JdbcConnection(connection);
    }
}
