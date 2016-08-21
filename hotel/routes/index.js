var express = require('express');
var router  = express.Router(),
    parse   = require('../helpers/parser'),
    crypto = require('crypto'),
    Hotel   = require('../models/hotel'),
    Counter = require('../models/counters'),
    creator = require('../helpers/bookingcreator');

router.get('/ping', function(req, res, next) {
  res.sendStatus(201);
});

router.get('/hotel/:id',function(req, res, next){
  Hotel.get(req.params.id, function(err, record){
    if(record){
      var hotel = parse.hotel(req.headers.accept, record);

      if(!hotel){
        res.sendStatus(418);
      } else {
        res.send(hotel);
      }
    } else {
      res.sendStatus(404)
    }
  })
});

router.post('/hotel', function(req, res, next) {
  newHotel = req.body;

  Hotel.create(newHotel, function(err, hotel){
    if(err)
      res.sendStatus(500);
    else {
      var record = parse.hotelWithId(req, hotel);

      if(!record){
        res.sendStatus(418);
      } else {
        res.send(record);
      }
    }
  })
});

router.put('/hotel/:id', function(req, res, next) {
  Hotel.update(req.params.id, req.body, function(err){
    Hotel.get(req.params.id, function(err, record){
      if(record){
        var hotel = parse.hotel(req.headers.accept, record);

        if(!hotel){
          res.sendStatus(418);
        } else {
          res.send(hotel);
        }
      } else {
        res.sendStatus(405);
      }
    })
  })
});

router.delete('/hotel/:id', function(req, res, next) {
  Hotel.get(req.params.id, function(err, record){
    if(record){
      Hotel.delete(req.params.id, function(err){
        res.sendStatus(201);
      });
    } else {
      res.sendStatus(405);
    }
  });
});

module.exports = router;
