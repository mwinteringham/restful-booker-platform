var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    mongoose     = require('mongoose'),
    assert       = require('assert'),
    booking      = require('../../booking/models/booking.js'),
    hotel        = require('../../hotel/models/hotel.js');

mongoose.createConnection('mongodb://localhost/restful-booker-platform');

var generatePayload = function(hotelid, firstname, lastname, totalprice, depositpaid, additionalneeds, checkin, checkout){
  var payload = {
      'hotelid' : hotelid,
      'firstname': firstname,
      'lastname': lastname,
      'totalprice': totalprice,
      'depositpaid': depositpaid,
      'bookingdates': {
        'checkin': checkin,
        'checkout': checkout
      }
    }

  if(typeof(additionalneeds) !== 'undefined'){
    payload.additionalneeds = additionalneeds;
  }

  return payload
}

var payload  = generatePayload(1, 'Sally', 'Brown', 111, true, 'Breakfast', '2013-02-01', '2013-02-04'),
    payload2 = generatePayload(2, 'Brown', 'Geoff', 111, true, 'Breakfast', '2013-02-01', '2013-02-04'),
    payload3 = generatePayload(3, 'Geoff', 'White', 111, true, 'Breakfast', '2013-02-01', '2013-02-04');

var server = require('../app')

describe('restful-booker-platform /search', function () {

  it('responds to /ping', function testPing(done){
    request(server)
      .get('/ping')
      .expect(201, done);
  });

  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });

});

describe('restful-booker-platform GET /search', function () {
  beforeEach(function(){
    mongoose.connection.db.dropDatabase();
  });

  it('should respond with a 200 and the hotel details when searching for a hotel', function(done){
    hotel.create({"name": "hotel one"}, function(){
      request(server)
        .get('/search?keyword=one')
        .expect(200)
        .expect(function(res){
          res.body.should.deep.equal({"hotels":[
            {
              "hotelid": 1,
              "name": "hotel one"
            }
          ]});
        })
        .end(done)
    });
  });

  it('should respond with a 200 and the hotel details when searching for a hotel by hotel id', function(done){
    booking.create(payload, function(){
      request(server)
        .get('/search?hotelid=1')
        .expect(200)
        .expect(function(res){
          res.body.should.deep.equal({"bookings":[
            {
              "bookingid": 1,
              "hotelid": 1,
              "firstname": 'Sally',
              "lastname": 'Brown',
              "totalprice": 111,
              "depositpaid": true,
              "bookingdates": {
                "checkin": '2013-02-01T00:00:00.000Z',
                "checkout": '2013-02-04T00:00:00.000Z'
              },
              "additionalneeds": 'Breakfast'
            }
          ]});
        })
        .end(done)
    })
  });

  it('should respond with a 200 and multiple hotel details when searching for multiple hotels', function(done){
    hotel.create({"name": "hotel one"}, function(){
      hotel.create({"name": "hotel two"}, function(){
        hotel.create({"name": "hostel three"}, function(){
          request(server)
            .get('/search?keyword=hotel')
            .expect(200)
            .expect(function(res){
              res.body.should.deep.equal({"hotels":[
                {
                  "hotelid": 1,
                  "name": "hotel one"
                },
                {
                  "hotelid": 2,
                  "name": "hotel two"
                }
              ]});
            })
            .end(done)
        })
      })
    });
  });

  it('should respond with a 200 and the booking details when searching for a booking by firstname', function(done){
    booking.create(payload, function(){
      request(server)
        .get('/search?keyword=Sally')
        .expect(200)
        .expect(function(res){
          res.body.should.deep.equal({"bookings":[
            {
              "bookingid": 1,
              "hotelid": 1,
              "firstname": 'Sally',
              "lastname": 'Brown',
              "totalprice": 111,
              "depositpaid": true,
              "bookingdates": {
                "checkin": '2013-02-01T00:00:00.000Z',
                "checkout": '2013-02-04T00:00:00.000Z'
              },
              "additionalneeds": 'Breakfast'
            }
          ]});
        })
        .end(done)
    })
  });

  it('should respond with a 200 and the booking details when searching for a booking by lastname', function(done){
    booking.create(payload, function(){
      request(server)
        .get('/search?keyword=Brown')
        .expect(200)
        .expect(function(res){
          res.body.should.deep.equal({"bookings":[
            {
              "bookingid": 1,
              "hotelid": 1,
              "firstname": 'Sally',
              "lastname": 'Brown',
              "totalprice": 111,
              "depositpaid": true,
              "bookingdates": {
                "checkin": '2013-02-01T00:00:00.000Z',
                "checkout": '2013-02-04T00:00:00.000Z'
              },
              "additionalneeds": 'Breakfast'
            }
          ]});
        })
        .end(done)
    })
  });

  it('should respond with a 200 and multiple booking details when searching for multiple booking', function(done){
    booking.create(payload, function(){
      booking.create(payload2, function(){
        booking.create(payload3, function(){
          request(server)
            .get('/search?keyword=Brown')
            .expect(200)
            .expect(function(res){
              res.body.should.deep.equal({"bookings":[
                {
                  "bookingid": 1,
                  "hotelid": 1,
                  "firstname": 'Sally',
                  "lastname": 'Brown',
                  "totalprice": 111,
                  "depositpaid": true,
                  "bookingdates": {
                    "checkin": '2013-02-01T00:00:00.000Z',
                    "checkout": '2013-02-04T00:00:00.000Z'
                  },
                  "additionalneeds": 'Breakfast'
                },{
                  "bookingid": 2,
                  "hotelid": 2,
                  "firstname": 'Brown',
                  "lastname": 'Geoff',
                  "totalprice": 111,
                  "depositpaid": true,
                  "bookingdates": {
                    "checkin": '2013-02-01T00:00:00.000Z',
                    "checkout": '2013-02-04T00:00:00.000Z'
                  },
                  "additionalneeds": 'Breakfast'
                }
              ]});
            })
            .end(done)
        })
      })
    });
  });

  it('should respond with a 200 and multiple records when searching for both booking and hotels', function(done){
    booking.create(payload, function(){
      booking.create(payload3, function(){
        hotel.create({"name": "hotel Brown"}, function(){
          hotel.create({"name": "hostel one"}, function(){
            request(server)
              .get('/search?keyword=Brown')
              .expect(200)
              .expect(function(res){
                res.body.should.deep.equal({
                  "hotels":[{
                      "hotelid": 3,
                      "name": "hotel Brown"
                    },
                  ],
                  "bookings":[{
                    "bookingid": 1,
                    "hotelid": 1,
                    "firstname": 'Sally',
                    "lastname": 'Brown',
                    "totalprice": 111,
                    "depositpaid": true,
                    "bookingdates": {
                      "checkin": '2013-02-01T00:00:00.000Z',
                      "checkout": '2013-02-04T00:00:00.000Z'
                    },
                    "additionalneeds": 'Breakfast'
                  }
                ]});
              })
              .end(done)
          });
        });
      });
    });
  });

});
