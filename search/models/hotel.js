var mongoose = require('mongoose'),
    config = require('../helpers/env');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://' + config.database() + '/restful-booker-platform');

var hotelSchema = mongoose.Schema({
    hotelid: {type: Number},
    name: { type: String, required: true}
  }, { versionKey: false });

var Hotel = mongoose.model('Hotel', hotelSchema);

exports.search = function(query, callback){
  Hotel.find(query).select('hotelid name -_id').exec(function(err, records){
    if(err){
      callback(err);
    } else {
      callback(null, records);
    }
  });
}
