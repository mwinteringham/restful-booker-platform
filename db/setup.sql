CREATE DATABASE rbp;
USE rbp;
CREATE table BOOKINGS ( bookingid int NOT NULL AUTO_INCREMENT, hotelid int, firstname varchar(255), lastname varchar(255), totalprice int, depositpaid Boolean, checkin Date, checkout Date, primary key (bookingid));