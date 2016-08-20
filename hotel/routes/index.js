var express = require('express');
var router  = express.Router(),
    parse   = require('../helpers/parser'),
    crypto = require('crypto'),
    Hotel   = require('../models/hotel'),
    Counter = require('../models/counters'),
    creator = require('../helpers/bookingcreator'),
    globalLogins = {};

// Booking.deleteAll(function(err){
//   if(err) return console.error(err);
//
//   Counter.resetCounter(function() {
//     var count = 1;
//
//     (function createBooking(){
//       var newBooking = creator.createBooking()
//
//       Booking.create(newBooking, function(err, result){
//         if(err) return console.error(err);
//
//         if(count < 10){
//           count++;
//           createBooking();
//         }
//       });
//     })()
//   });
// });

router.get('/ping', function(req, res, next) {
  res.sendStatus(201);
});

// router.get('/booking/:id',function(req, res, next){
//   Booking.get(req.params.id, function(err, record){
//     if(record){
//       var booking = parse.booking(req.headers.accept, record);
//
//       if(!booking){
//         res.sendStatus(418);
//       } else {
//         res.send(booking);
//       }
//     } else {
//       res.sendStatus(404)
//     }
//   })
// });
//
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
//
// router.put('/booking/:id', function(req, res, next) {
//   if(globalLogins[req.cookies.token] || req.headers.authorization == 'Basic YWRtaW46cGFzc3dvcmQxMjM='){
//     Booking.update(req.params.id, req.body, function(err){
//       Booking.get(req.params.id, function(err, record){
//         if(record){
//           var booking = parse.booking(req.headers.accept, record);
//
//           if(!booking){
//             res.sendStatus(418);
//           } else {
//             res.send(booking);
//           }
//         } else {
//           res.sendStatus(405);
//         }
//       })
//     })
//   } else {
//     res.sendStatus(403);
//   }
// });
//
// router.delete('/booking/:id', function(req, res, next) {
//   if(globalLogins[req.cookies.token] || req.headers.authorization == 'Basic YWRtaW46cGFzc3dvcmQxMjM='){
//     Booking.get(req.params.id, function(err, record){
//       if(record){
//         Booking.delete(req.params.id, function(err){
//             res.sendStatus(201);
//         });
//       } else {
//         res.sendStatus(405);
//       }
//     });
//   } else {
//     res.sendStatus(403);
//   }
// });
//
// router.post('/auth', function(req, res, next){
//   if(req.body.username === "admin" && req.body.password === "password123"){
//     var token = crypto.randomBytes(Math.ceil(15/2))
//                     .toString('hex')
//                     .slice(0,15);
//
//     globalLogins[token] = true;
//
//     res.send({'token': token});
//   } else {
//     res.send({'reason': 'Bad credentials'});
//   }
// })

module.exports = router;
