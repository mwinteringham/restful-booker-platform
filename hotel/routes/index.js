var express = require('express');
var router  = express.Router(),
    parse   = require('../helpers/parser'),
    crypto  = require('crypto'),
    request = require('request'),
    Hotel   = require('../models/hotel'),
    Counter = require('../models/counters'),
    config = require('../helpers/env');

router.get('/ping', function(req, res, next) {
  res.sendStatus(201);
});

router.get('/hotel/:id',function(req, res, next){
  Hotel.get({'hotelid': req.params.id}, function(err, record){
    if(record.length > 0){
      var hotel = parse.hotel(req.headers.accept, record[0]);

      if(!hotel){
        res.sendStatus(418);
      } else {
        request('http://' + config.search() +':3002/search?hotelid=' + req.params.id, function(error, response, body){
          if(error) res.sendStatus(500);

          if(response.body) hotel.bookings = JSON.parse(response.body).bookings;

          res.send(hotel);
        })
      }
    } else {
      res.sendStatus(404)
    }
  })
});

router.get('/hotel', function(req, res, next){
  Hotel.get({}, function(err, record){
    if(err) res.sendStatus(500);

    res.send(record);
  })
})

router.post('/hotel', function(req, res, next) {
  newHotel = req.body;

  var options = {
    uri: 'http://' + config.auth() + ':3004/validate',
    method: 'POST',
    json: {
      "token": req.cookies.token
    }
  };

  request(options, function(error, response, body){
    if(response.statusCode == 200){
      Hotel.create(newHotel, function(err, hotel){
        console.log()
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
    } else {
      res.sendStatus(403);
    }
  });
});

router.put('/hotel/:id', function(req, res, next) {
  var options = {
    uri: 'http://' + config.auth() + ':3004/validate',
    method: 'POST',
    json: {
      "token": req.cookies.token
    }
  };

  request(options, function(error, response, body){
    if(response.statusCode == 200){
      Hotel.update(req.params.id, req.body, function(err){
        Hotel.get({'hotelid': req.params.id}, function(err, record){
          if(record.length > 0){
            var hotel = parse.hotel(req.headers.accept, record[0]);

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
    } else {
      res.sendStatus(403);
    }
  });
});

router.delete('/hotel/:id', function(req, res, next) {
  var options = {
    uri: 'http://' + config.auth() + ':3004/validate',
    method: 'POST',
    json: {
      "token": req.cookies.token
    }
  };

  request(options, function(error, response, body){
    if(response.statusCode == 200){
      Hotel.get({'hotelid': req.params.id}, function(err, record){
        if(record.length > 0){
          Hotel.delete(req.params.id, function(err){
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
