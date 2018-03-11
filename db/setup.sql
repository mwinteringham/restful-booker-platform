CREATE DATABASE rbp;
USE rbp;
CREATE table HOTELS ( hotelid int NOT NULL AUTO_INCREMENT, name varchar(255), address varchar(255), regdate Date, contactName varchar(255), contactPhone varchar(255), contactEmail varchar(255), primary key (hotelid));
CREATE table BOOKINGS ( bookingid int NOT NULL AUTO_INCREMENT, hotelid int, firstname varchar(255), lastname varchar(255), totalprice int, depositpaid Boolean, checkin Date, checkout Date, primary key (bookingid));

INSERT INTO HOTELS (name, address, regdate, contactName, contactPhone, contactEmail) VALUES('Hilton', '52 The Street, City', '2018-01-01', 'Mark', '01612829348', 'mark@hilton.com');
INSERT INTO BOOKINGS(hotelid, firstname, lastname, totalprice, depositpaid, checkin, checkout) VALUES(1,'James','Dean',100,true,'2018-02-26','2018-02-26');