package com.automationintesting.db;

import com.automationintesting.model.db.Branding;
import org.h2.jdbcx.JdbcDataSource;
import org.h2.tools.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@Component
public class BrandingDB {

    private Connection connection;
    private Logger logger = LoggerFactory.getLogger(BrandingDB.class);

    private final String SELECT_ALL_BRANDINGS = "SELECT * FROM BRANDINGS";
    private final String DELETE_BRANDING = "DELETE FROM BRANDINGS";
    private final String RESET_INCREMENT = "ALTER TABLE BRANDINGS ALTER COLUMN brandingid RESTART WITH 1";

    public BrandingDB() throws SQLException, IOException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        executeSqlFile("db.sql");
        executeSqlFile("seed.sql");

        // If you would like to access the DB for this API locally. Run this API with
        // the environmental variable dbServer to true.
        try{
            if(System.getenv("dbServer").equals("true")){
                Server.createTcpServer("-tcpPort", "9092", "-tcpAllowOthers").start();
                logger.info("DB server mode enabled");
            } else {
                logger.info("DB server mode disabled");
            }
        } catch (NullPointerException e){
            logger.info("DB server mode disabled");
        }
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

    public void resetDB() throws SQLException, IOException {
        PreparedStatement ps = connection.prepareStatement(DELETE_BRANDING);
        ps.executeUpdate();

        PreparedStatement ps2 = connection.prepareStatement(RESET_INCREMENT);
        ps2.executeUpdate();

        executeSqlFile("seed.sql");
    }

    private void executeSqlFile(String filename) throws IOException, SQLException {
        Reader reader = new InputStreamReader( new ClassPathResource(filename).getInputStream());
        Scanner sc = new Scanner(reader);

        StringBuffer sb = new StringBuffer();
        while(sc.hasNext()){
            sb.append(sc.nextLine());
        }

        connection.prepareStatement(sb.toString()).executeUpdate();
    }
}
