var dateFormat = require('dateformat');

exports.bookingids = function(req, rawBooking){
  var payload = [];

  rawBooking.forEach(function(b){
    var tmpBooking = {
      bookingid: b.bookingid,
    }

    payload.push(tmpBooking);
  });

  return payload;
}

exports.hotel = function(accept, rawHotel){
	var hotel = {
    "name" : rawHotel.name,
    "address" : rawHotel.address,
    "regdate" : rawHotel.regdate,
    "contact" : {
      "name" : rawHotel.contact.name,
      "phone" : rawHotel.contact.phone,
      "email" : rawHotel.contact.email
    }
  }

  switch(accept){
    case 'application/json':
      return hotel;
      break;
    case '*/*':
      return hotel;
      break;
    default:
      return null;
  }
}

exports.hotelWithId = function(req, rawHotel){
  var hotel = {
    "name" : rawHotel.name,
    "address" : rawHotel.address,
    "regdate" : rawHotel.regdate,
    "contact" : {
      "name" : rawHotel.contact.name,
      "phone" : rawHotel.contact.phone,
      "email" : rawHotel.contact.email
    }
  }

  var payload = {
    "hotelid" : rawHotel.hotelid,
    "hotel" : hotel
  }

  switch(req.headers.accept){
    case 'application/json':
      return payload;
      break;
    case '*/*':
      return payload;
      break;
    default:
      return null;
  }
}
