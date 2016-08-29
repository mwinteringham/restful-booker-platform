var mongoose = require('mongoose'),
    config = require('../helpers/env');

mongoose.Promise = require('bluebird');
mongoose.createConnection('mongodb://' + config.database() + '/restful-booker-platform');

var bookingSchema = mongoose.Schema({
    bookingid: {type: Number},
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    totalprice: { type: Number, required: true},
    depositpaid: { type: Boolean, required: true},
    bookingdates: {
      checkin: { type: Date, required: true},
      checkout: { type: Date, required: true}
    },
    additionalneeds: { type: String, required: false}
  }, { versionKey: false });

var Booking = mongoose.model('Booking', bookingSchema);

exports.search = function(query, callback){
  Booking.find(query).select('-_id').exec(function(err, booking){
    if(err){
      callback(err);
    } else {
      callback(null, booking);
    }
  });
}
