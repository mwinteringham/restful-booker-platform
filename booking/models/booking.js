var mongoose = require('mongoose'),
    dateFormat = require('dateformat'),
    counter = require('./counters'),
    config = require('../helpers/env');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://' + config.database() + '/restful-booker-platform');

var bookingSchema = mongoose.Schema({
    bookingid: {type: Number},
    hotelid: {type: Number},
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

bookingSchema.pre('save', function(next) {
    var doc = this;

    counter.bumpId(doc, function(id){
      doc.bookingid = id;
      next();
    });
});

exports.get = function(id, callback){
  Booking.find({'bookingid': id}, function(err, booking){
    if(err){
      callback(err, null)
    } else {
      callback(null, booking[0]);
    }
  })
},

exports.create = function(payload, callback){
  var newBooking = new Booking(payload);

  newBooking.save(function(err, booking){
    if(err){
      callback(err);
    } else {
      callback(null, booking);
    }
  });
},

exports.update = function(id, updatedBooking, callback){
  Booking.find({'bookingid': id}).update(updatedBooking, function(err){
    callback(err);
  });
},

exports.delete = function(id, callback){
  Booking.remove({'bookingid': id}, function(err){
    callback(null);
  })
}
