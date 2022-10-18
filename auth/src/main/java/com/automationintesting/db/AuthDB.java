package com.automationintesting.db;

import com.automationintesting.model.Auth;
import com.automationintesting.model.Token;
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
import java.util.Scanner;

@Component
public class AuthDB {

    private final String DELETE_ALL_TOKENS = "DELETE FROM TOKENS";
    private final String SELECT_BY_TOKEN = "SELECT * FROM TOKENS WHERE token = ?";
    private final String DELETE_BY_TOKEN = "DELETE FROM TOKENS WHERE token = ?";
    private final String SELECT_BY_CREDENTIALS = "SELECT * FROM ACCOUNTS WHERE username = ? AND password = ?";

    private Connection connection;
    private Logger logger = LoggerFactory.getLogger(AuthDB.class);

    public AuthDB() throws SQLException, IOException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp-auth;MODE=MySQL");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        executeSqlFile("db.sql");
        executeSqlFile("seed.sql");

        // If you would like to access the DB for this API locally. Run this API with
        // the environmental variable dbServer to true.
        try{
            if(System.getenv("dbServer").equals("true")){
                Server.createTcpServer("-tcpPort", "9091", "-tcpAllowOthers").start();
                logger.info("DB server mode enabled");
            } else {
                logger.info("DB server mode disabled");
            }
        } catch (NullPointerException e){
            logger.info("DB server mode disabled");
        }
    }

    public Boolean insertToken(Token token) throws SQLException {
        PreparedStatement createPs = token.getPreparedStatement(connection);

        return createPs.executeUpdate() > 0;
    }

    public Token queryToken(Token token) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(SELECT_BY_TOKEN);
        ps.setString(1, token.getToken());

        ResultSet result = ps.executeQuery();
//        result.next();

        if(result.next()) {
            return new Token(result.getString("token"), result.getDate("expiry"));
        } else {
           return null;
        }
    }

    public Boolean deleteToken(Token token) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(DELETE_BY_TOKEN);
        ps.setString(1, token.getToken());

        int resultSet = ps.executeUpdate();
        return resultSet == 1;
    }

    public Boolean queryCredentials(Auth auth) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(SELECT_BY_CREDENTIALS);
        ps.setString(1, auth.getUsername());
        ps.setString(2, auth.getPassword());

        ResultSet result = ps.executeQuery();
        result.next();

        return result.getRow() > 0;
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

    public void resetDB() throws SQLException, IOException {
        PreparedStatement ps = connection.prepareStatement(DELETE_ALL_TOKENS);
        ps.executeUpdate();

        executeSqlFile("seed.sql");
    }
}
