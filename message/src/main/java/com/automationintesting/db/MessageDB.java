package com.automationintesting.db;

import com.automationintesting.model.Message;
import com.automationintesting.model.MessageSummary;
import org.h2.jdbcx.JdbcDataSource;
import org.h2.tools.Server;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MessageDB {

    private Connection connection;

    private final String CREATE_DB = "CREATE table MESSAGES ( messageid int NOT NULL AUTO_INCREMENT, name varchar(255), email varchar(255), phone varchar(255), subject varchar(255), description CLOB, primary key (messageid));";
    private final String SELECT_BY_MESSAGEID = "SELECT * FROM MESSAGES WHERE messageid = ?";
    private final String DELETE_BY_MESSAGEID = "DELETE FROM MESSAGES WHERE messageid = ?";
    private final String DELETE_ALL_MESSAGES = "DELETE FROM MESSAGES";
    private final String SELECT_MESSAGES = "SELECT * FROM MESSAGES";
    private final String SELECT_MESSAGE_SUMMARY = "SELECT messageid, name, subject FROM MESSAGE";

    public MessageDB(boolean enableServer) throws SQLException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        if (enableServer) {
            Server server = Server.createTcpServer("-tcpPort", "9093", "-tcpAllowOthers").start();
        }

        connection.prepareStatement(CREATE_DB).executeUpdate();

        Message message = new Message("James Dean", "james@email.com", "01402 619211", "Booking enquiry", "I'm looking to book a room at your place");

        InsertSql insertSql = new InsertSql(connection, message);
        insertSql.getPreparedStatement().executeUpdate();
    }

    public Message create(Message room) throws SQLException {
        InsertSql insertSql = new InsertSql(connection, room);
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

    public void resetDB() throws SQLException {
        PreparedStatement ps = connection.prepareStatement(DELETE_ALL_MESSAGES);

        ps.executeUpdate();

        PreparedStatement resetPs = connection.prepareStatement("ALTER TABLE MESSAGES ALTER COLUMN messageid RESTART WITH 1");

        resetPs.execute();
    }

    public Message query(int id) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(SELECT_BY_MESSAGEID);
        ps.setInt(1, id);

        ResultSet result = ps.executeQuery();
        result.next();

        return new Message(result);
    }

    public Boolean delete(int bookingid) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(DELETE_BY_MESSAGEID);
        ps.setInt(1, bookingid);

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

}
