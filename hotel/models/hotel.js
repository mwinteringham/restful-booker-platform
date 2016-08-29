var mongoose = require('mongoose'),
    dateFormat = require('dateformat'),
    counter = require('./counters'),
    config = require('../helpers/env');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://' + config.database() + '/restful-booker-platform');

var hotelSchema = mongoose.Schema({
    hotelid: { type: Number},
    name: { type: String, required: true},
    address: { type: String, required: true },
    regdate: { type: Date, required: true },
    contact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true}
    }
  }, { versionKey: false });

var Hotel = mongoose.model('Hotel', hotelSchema);

hotelSchema.pre('save', function(next) {
    var doc = this;

    counter.bumpId(doc, function(id){
      doc.hotelid = id;
      next();
    });
});

exports.get = function(query, callback){
  Hotel.find(query).select('-_id').exec(function(err, hotel){
    if(err){
      callback(err, null)
    } else {
      callback(null, hotel);
    }
  })
},

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

exports.update = function(id, updatedHotel, callback){
  Hotel.find({'hotelid': id}).update(updatedHotel, function(err){
    callback(err);
  });
},

exports.delete = function(id, callback){
  Hotel.remove({'hotelid': id}, function(err){
    callback(null);
  })
}
