CREATE DATABASE rbp;
USE rbp;
CREATE table BOOKINGS ( bookingid int NOT NULL AUTO_INCREMENT, hotelid int, firstname varchar(255), lastname varchar(255), totalprice int, depositpaid Boolean, checkin Date, checkout Date, primary key (bookingid));
CREATE table HOTELS ( hotelid int NOT NULL AUTO_INCREMENT, name varchar(255), address varchar(255), regdate Date, contactName varchar(255), contactPhone varchar(255), contactEmail varchar(255), primary key (hotelid));