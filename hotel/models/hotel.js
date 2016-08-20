var mongoose = require('mongoose'),
    dateFormat = require('dateformat'),
    counter = require('./counters');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/restful-booker-platform');

var hotelSchema = mongoose.Schema({
    hotelid: {type: Number},
    name: { type: String, required: true}
  }, { versionKey: false });

var Hotel = mongoose.model('Hotel', hotelSchema);

hotelSchema.pre('save', function(next) {
    var doc = this;

    counter.bumpId(doc, function(id){
      doc.hotelid = id;
      next();
    });
});

// exports.get = function(id, callback){
//   Booking.find({'bookingid': id}, function(err, booking){
//     if(err){
//       callback(err, null)
//     } else {
//       callback(null, booking[0]);
//     }
//   })
// },

exports.create = function(payload, callback){
  var newHotel = new Hotel(payload);

  newHotel.save(function(err, booking){
    if(err){
      callback(err);
    } else {
      callback(null, booking);
    }
  });
}

// exports.update = function(id, updatedBooking, callback){
//   Booking.find({'bookingid': id}).update(updatedBooking, function(err){
//     callback(err);
//   });
// },
//
// exports.delete = function(id, callback){
//   Booking.remove({'bookingid': id}, function(err){
//     callback(null);
//   })
// },
//
// exports.deleteAll = function(callback){
//   Booking.remove({}, function(err){
//     callback(null);
//   })
// }
