package com.automationintesting.db;

import com.automationintesting.model.db.Branding;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UpdateSql {

    private PreparedStatement preparedStatement;

    UpdateSql(Connection connection, Branding branding) throws SQLException {
        String UPDATE_BRANDING = "UPDATE PUBLIC.brandings SET name = ?, latitude = ?, longitude = ?, logo_url = ?, description = ?, contact_name = ?, address = ?, phone = ?, email = ? WHERE brandingid = 1";

        preparedStatement = connection.prepareStatement(UPDATE_BRANDING);
        preparedStatement.setString(1, branding.getName());
        preparedStatement.setDouble(2, branding.getMap().getLatitude());
        preparedStatement.setDouble(3, branding.getMap().getLongitude());
        preparedStatement.setString(4, branding.getLogoUrl());
        preparedStatement.setString(5, branding.getDescription());
        preparedStatement.setString(6, branding.getContact().getName());
        preparedStatement.setString(7, branding.getContact().getAddress());
        preparedStatement.setString(8, branding.getContact().getPhone());
        preparedStatement.setString(9, branding.getContact().getEmail());
    }

    public PreparedStatement getPreparedStatement() {
        return preparedStatement;
    }

}
