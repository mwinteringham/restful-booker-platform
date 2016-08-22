var express = require('express');
var router  = express.Router(),
    parse   = require('../helpers/parser'),
    crypto = require('crypto'),
    Booking = require('../models/booking'),
    Counter = require('../models/counters');

router.get('/ping', function(req, res, next) {
  res.sendStatus(201);
});

router.get('/booking/:id',function(req, res, next){
  Booking.get(req.params.id, function(err, record){
    if(record){
      var booking = parse.booking(req.headers.accept, record);

      if(!booking){
        res.sendStatus(418);
      } else {
        res.send(booking);
      }
    } else {
      res.sendStatus(404)
    }
  })
});

router.post('/booking', function(req, res, next) {
  newBooking = req.body;

  Booking.create(newBooking, function(err, booking){
    if(err)
      res.sendStatus(500);
    else {
      var record = parse.bookingWithId(req, booking);

      if(!record){
        res.sendStatus(418);
      } else {
        res.send(record);
      }
    }
  })
});

router.put('/booking/:id', function(req, res, next) {
  Booking.update(req.params.id, req.body, function(err){
    Booking.get(req.params.id, function(err, record){
      if(record){
        var booking = parse.booking(req.headers.accept, record);

        if(!booking){
          res.sendStatus(418);
        } else {
          res.send(booking);
        }
      } else {
        res.sendStatus(405);
      }
    })
  })
});

router.delete('/booking/:id', function(req, res, next) {
  Booking.get(req.params.id, function(err, record){
    if(record){
      Booking.delete(req.params.id, function(err){
          res.sendStatus(201);
      });
    } else {
      res.sendStatus(405);
    }
  });
});

module.exports = router;
