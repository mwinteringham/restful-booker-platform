package com.automationintesting.db;

import com.automationintesting.model.db.Message;
import com.automationintesting.model.db.MessageSummary;
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
public class MessageDB {

    private Connection connection;
    private Logger logger = LoggerFactory.getLogger(MessageDB.class);

    private final String SELECT_BY_MESSAGEID = "SELECT * FROM MESSAGES WHERE messageid = ?";
    private final String DELETE_BY_MESSAGEID = "DELETE FROM MESSAGES WHERE messageid = ?";
    private final String DELETE_ALL_MESSAGES = "DELETE FROM MESSAGES";
    private final String SELECT_MESSAGES = "SELECT * FROM MESSAGES";
    private final String SELECT_UNREAD_MESSAGE = "SELECT * FROM MESSAGES WHERE read = 'false'";
    private final String UPDATE_MESSAGE_READ = "UPDATE MESSAGES SET read = 'true' WHERE messageid = ?";
    private final String RESET_INCREMENT = "ALTER TABLE MESSAGES ALTER COLUMN messageid RESTART WITH 1";

    public MessageDB() throws SQLException, IOException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp;MODE=MySQL");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        executeSqlFile("db.sql");
        executeSqlFile("seed.sql");

        // If you would like to access the DB for this API locally. Run this API with
        // the environmental variable dbServer to true.
        try{
            if(System.getenv("dbServer").equals("true")){
                Server.createTcpServer("-tcpPort", "9093", "-tcpAllowOthers").start();
                logger.info("DB server mode enabled");
            } else {
                logger.info("DB server mode disabled");
            }
        } catch (NullPointerException e){
            logger.info("DB server mode disabled");
        }
    }

    public Message create(Message message) throws SQLException {
        InsertSql insertSql = new InsertSql(connection, message);
        PreparedStatement createPs = insertSql.getPreparedStatement();

        if(createPs.executeUpdate() > 0){
            ResultSet lastInsertId = connection.prepareStatement("SELECT LAST_INSERT_ID()").executeQuery();
            lastInsertId.next();

            PreparedStatement ps = connection.prepareStatement(SELECT_BY_MESSAGEID);
            ps.setInt(1, lastInsertId.getInt("LAST_INSERT_ID()"));

            ResultSet result = ps.executeQuery();
            result.next();

            return new Message(result);
        } else {
            return null;
        }
    }

    public void resetDB() throws SQLException, IOException {
        PreparedStatement ps = connection.prepareStatement(DELETE_ALL_MESSAGES);
        ps.executeUpdate();

        PreparedStatement ps2 = connection.prepareStatement(RESET_INCREMENT);
        ps2.executeUpdate();

        executeSqlFile("seed.sql");
    }

    public Message query(int id) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(SELECT_BY_MESSAGEID);
        ps.setInt(1, id);

        ResultSet result = ps.executeQuery();
        result.next();

        return new Message(result);
    }

    public Boolean delete(int messageId) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(DELETE_BY_MESSAGEID);
        ps.setInt(1, messageId);

        int resultSet = ps.executeUpdate();
        return resultSet == 1;
    }

    public List<MessageSummary> queryMessages() throws SQLException {
        List<MessageSummary> messageSummaries = new ArrayList<>();

        PreparedStatement ps = connection.prepareStatement(SELECT_MESSAGES);

        ResultSet results = ps.executeQuery();
        while(results.next()){
            messageSummaries.add(new MessageSummary(results));
        }

        return messageSummaries;
    }

    public void markAsRead(int messageId) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(UPDATE_MESSAGE_READ);
        ps.setInt(1, messageId);

        ps.executeUpdate();
    }

    public int getUnreadCount() throws SQLException {
        PreparedStatement ps = connection.prepareStatement(SELECT_UNREAD_MESSAGE);

        ResultSet result = ps.executeQuery();

        return result.last() ? result.getRow() : 0;
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
