var express = require('express');
var router  = express.Router(),
    parse   = require('../helpers/parser'),
    crypto = require('crypto'),
    request = require('request'),
    Booking = require('../models/booking'),
    Counter = require('../models/counters'),
    config = require('../helpers/env');

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

  var options = {
    uri: 'http://' + config.auth() + ':3004/validate',
    method: 'POST',
    json: {
      "token": req.cookies.token
    }
  };

  request(options, function(error, response, body){
    if(response.statusCode == 200){
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
      });
    } else {
      res.sendStatus(403);
    }
  });
});

router.put('/booking/:id', function(req, res, next) {
  var options = {
    uri: 'http://' + config.auth() + ':3004/validate',
    method: 'POST',
    json: {
      "token": req.cookies.token
    }
  };

  request(options, function(error, response, body){
    if(response.statusCode == 200){
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
      });
    } else {
      res.sendStatus(403);
    }
  });
});

router.delete('/booking/:id', function(req, res, next) {
  var options = {
    uri: 'http://' + config.auth() + ':3004/validate',
    method: 'POST',
    json: {
      "token": req.cookies.token
    }
  };

  request(options, function(error, response, body){
    if(response.statusCode == 200){
      Booking.get(req.params.id, function(err, record){
        if(record){
          Booking.delete(req.params.id, function(err){
              res.sendStatus(201);
          });
        } else {
          res.sendStatus(405);
        }
      });
    } else {
      res.sendStatus(403);
    }
  });
});

module.exports = router;
