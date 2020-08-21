package com.automationintesting.db;

import com.automationintesting.model.db.Room;
import org.h2.jdbcx.JdbcDataSource;
import org.h2.tools.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@Component
public class RoomDB {

    private Connection connection;
    private Logger logger = LoggerFactory.getLogger(RoomDB.class);

    private final String SELECT_ROOMS = "SELECT * FROM ROOMS";
    private final String SELECT_BY_ROOMID = "SELECT * FROM ROOMS WHERE roomid = ?";
    private final String DELETE_BY_ROOMID = "DELETE FROM ROOMS WHERE roomid = ?";
    private final String DELETE_ALL_ROOMS = "DELETE FROM ROOMS";
    private final String RESET_INCREMENT = "ALTER TABLE ROOMS ALTER COLUMN roomid RESTART WITH 1";

    public RoomDB() throws SQLException, IOException {
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
                Server.createTcpServer("-tcpPort", "9091", "-tcpAllowOthers").start();
                logger.info("DB server mode enabled");
            } else {
                logger.info("DB server mode disabled");
            }
        } catch (NullPointerException e){
            logger.info("DB server mode disabled");
        }
    }

    public Room create(Room room) throws SQLException {
        InsertSql insertSql = new InsertSql(connection, room);
        PreparedStatement createPs = insertSql.getPreparedStatement();

        if(createPs.executeUpdate() > 0){
            ResultSet lastInsertId = connection.prepareStatement("SELECT LAST_INSERT_ID()").executeQuery();
            lastInsertId.next();

            PreparedStatement ps = connection.prepareStatement(SELECT_BY_ROOMID);
            ps.setInt(1, lastInsertId.getInt("LAST_INSERT_ID()"));

            ResultSet result = ps.executeQuery();
            result.next();

            Room createdRoom = new Room(result);
            createdRoom.setRoomid(result.getInt("roomid"));

            return createdRoom;
        } else {
            return null;
        }
    }

    public Room query(int id) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(SELECT_BY_ROOMID);
        ps.setInt(1, id);

        ResultSet result = ps.executeQuery();
        result.next();

        return new Room(result);
    }

    public Boolean delete(int bookingid) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(DELETE_BY_ROOMID);
        ps.setInt(1, bookingid);

        int resultSet = ps.executeUpdate();
        return resultSet == 1;
    }

    public Room update(int id, Room room) throws SQLException {
        UpdateSql updateSql = new UpdateSql(connection, id, room);
        PreparedStatement updatePs = updateSql.getPreparedStatement();

        if(updatePs.executeUpdate() > 0){
            PreparedStatement ps = connection.prepareStatement(SELECT_BY_ROOMID);
            ps.setInt(1, id);

            ResultSet result = ps.executeQuery();
            result.next();

            Room createdRoom = new Room(result);
            createdRoom.setRoomid(result.getInt("roomid"));

            return createdRoom;
        } else {
            return null;
        }
    }

    public List<Room> queryRooms() throws SQLException {
        List<Room> listToReturn = new ArrayList<Room>();

        PreparedStatement ps = connection.prepareStatement(SELECT_ROOMS);

        ResultSet results = ps.executeQuery();
        while(results.next()){
            listToReturn.add(new Room(results));
        }

        return listToReturn;
    }

    public void seedDB() throws IOException, SQLException {
        PreparedStatement ps = connection.prepareStatement(DELETE_ALL_ROOMS);
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
