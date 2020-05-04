package com.automationintesting.db;

import com.automationintesting.model.db.Room;
import liquibase.Contexts;
import liquibase.Liquibase;
import liquibase.database.jvm.JdbcConnection;
import liquibase.exception.LiquibaseException;
import liquibase.resource.ClassLoaderResourceAccessor;
import liquibase.resource.ResourceAccessor;
import org.h2.jdbcx.JdbcDataSource;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Component
public class RoomDB {

    private Connection connection;
    private final String SELECT_ROOMS = "SELECT * FROM PUBLIC.ROOMS";
    private final String SELECT_BY_ROOMID = "SELECT * FROM PUBLIC.ROOMS WHERE roomid = ?";
    private final String DELETE_BY_ROOMID = "DELETE FROM PUBLIC.ROOMS WHERE roomid = ?";
    private final String DELETE_ALL_ROOMS = "DELETE FROM PUBLIC.ROOMS";

    public RoomDB() throws SQLException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp;MODE=MySQL");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        // If you would like to access the DB for this API locally. Uncomment the line below and
        // use a SQL client to access jdbc:h2:tcp://localhost:9091/mem:rbp
        // Server server = Server.createTcpServer("-tcpPort", "9091", "-tcpAllowOthers").start();
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

    public void resetDB() throws LiquibaseException {
        JdbcConnection connection = this.getConnection();

        ResourceAccessor resourceAccessor = new ClassLoaderResourceAccessor();

        Liquibase liquibase = new Liquibase("db/changelog/db.changelog-master.yaml", resourceAccessor, connection);

        liquibase.dropAll();

        liquibase.update(new Contexts());
    }

    public JdbcConnection getConnection() {
        return new JdbcConnection(connection);
    }
}
