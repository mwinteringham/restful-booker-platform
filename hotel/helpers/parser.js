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
	var booking = {
    'name' : rawHotel.name
  }

  switch(accept){
    case 'application/json':
      return booking;
      break;
    case '*/*':
      return booking;
      break;
    default:
      return null;
  }
}

exports.hotelWithId = function(req, rawHotel){
  var hotel = {
    'name' : rawHotel.name
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
