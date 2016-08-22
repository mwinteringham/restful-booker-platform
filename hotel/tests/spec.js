var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    mongoose     = require('mongoose'),
    booking      = require('../../booking/models/booking.js'),
    assert       = require('assert');

mongoose.createConnection('mongodb://localhost/restful-booker-platform');

var generatePayload = function(hotelName){
  return {
    name: hotelName
  }
};

var payload = generatePayload('hotel one'),
    payload2 = generatePayload('hotel two');

var server = require('../app')
var searchServer = require('../../search/app');

describe('restful-booker-platform /hotel', function () {

  beforeEach(function(){
    mongoose.connection.db.dropDatabase();
  });

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

describe('restful-booker-platform POST /hotel', function(){
  beforeEach(function(){
    mongoose.connection.db.dropDatabase();
  });

  it('should respond with a 200 and the payload when creating a hotel', function(done){
    request(server)
      .post('/hotel')
      .set('Accept', 'application/json')
      .send(payload)
      .expect(200)
      .expect(function(res){
        res.body.hotelid.should.equal(1);
        res.body.hotel.should.deep.equal(payload);
      })
      .end(done)
  });

  it('responds with a 500 error when a bad payload is sent', function testCreateBadBooking(done){
    badpayload = { 'badname': 'name'}

    request(server)
      .post('/hotel')
      .send(badpayload)
      .expect(500, done);
  });

  it('responds with a 200 when a payload with too many params are sent', function testCreateExtraPayload(done){
    var extraPayload = generatePayload('hotel two')
    extraPayload.extra = 'bad'

    request(server)
      .post('/hotel')
      .set('Accept', 'application/json')
      .send(extraPayload)
      .expect(200, done);
  });

  it('should respond with a 418 when using a bad accept header', function(done){
    request(server)
      .post('/hotel')
      .set('Accept', 'application/ogg')
      .send(payload)
      .expect(418, done)
  });

});

describe('restful-booker-platform GET /hotel', function(){

  it('should respond with a 200 and payload when getting a hotel resource', function(done){

    var bookingPayload = {
      "hotelid": 2,
      "firstname": 'Geoff',
      "lastname": 'White',
      "totalprice": 111,
      "depositpaid": true,
      "bookingdates": {
        "checkin": '2013-02-02',
        "checkout": '2013-02-05'
      },
      "additionalneeds": 'Breakfast'
    };

    var bookingPayload2 = {
      "hotelid": 2,
      "firstname": 'Barry',
      "lastname": 'White',
      "totalprice": 111,
      "depositpaid": true,
      "bookingdates": {
        "checkin": '2013-02-02',
        "checkout": '2013-02-05'
      },
      "additionalneeds": 'Breakfast'
    };

    request(server)
      .post('/hotel')
      .set('Accept', 'application/json')
      .send(payload)
      .then(function(res){
        booking.create(bookingPayload, function(){
          booking.create(bookingPayload2, function(){
            request(server)
              .get('/hotel/2')
              .set('Accept', 'application/json')
              .expect(200)
              .expect(function(res){
                res.body.should.deep.equal({
                  "name": "hotel one",
                  "bookings": [{
                    "hotelid": 2,
                    "bookingid": 3,
                    "firstname": 'Geoff',
                    "lastname": 'White',
                    "totalprice": 111,
                    "depositpaid": true,
                    "bookingdates": {
                      "checkin": '2013-02-02T00:00:00.000Z',
                      "checkout": '2013-02-05T00:00:00.000Z'
                    },
                    "additionalneeds": 'Breakfast'
                  }, {
                    "hotelid": 2,
                    "bookingid": 4,
                    "firstname": 'Barry',
                    "lastname": 'White',
                    "totalprice": 111,
                    "depositpaid": true,
                    "bookingdates": {
                      "checkin": '2013-02-02T00:00:00.000Z',
                      "checkout": '2013-02-05T00:00:00.000Z'
                    },
                    "additionalneeds": 'Breakfast'
                  }]
                });
              })
              .end(done)
          });
        });
      });
  });

  it('should respond with a 418 and payload when getting a hotel resource with no accept header', function(done){
    request(server)
      .post('/hotel')
      .set('Accept', 'application/json')
      .send(payload)
      .then(function(){
        request(server)
          .get('/hotel/1')
          .expect(418, done);
      })
  });

  it('should respond with a 418 and payload when getting a hotel resource with no accept header', function(done){
    request(server)
      .post('/hotel')
      .set('Accept', 'application/json')
      .send(payload)
      .then(function(){
        request(server)
          .get('/hotel/100000000')
          .expect(404, done);
      })
  });

});

describe('restful-booker-platform DELETE /hotel', function(){

  it('responds with a 201 when deleting an existing booking', function(done){
    request(server)
      .post('/hotel')
      .set('Accept', 'application/json')
      .send(payload)
      .then(function(res){
        request(server)
          .delete('/hotel/' + res.body.hotelid)
          .expect(201, done)
      })
  });

  it('responds with a 405 when deleting a booking that doesn\'t exist', function(done){
    request(server)
      .delete('/hotel/10000000')
      .expect(405, done)
  });

});

describe('restful-booker-platform PUT /hotel', function(){

  it('responds with a 200 and an updated payload', function(done){
    request(server)
      .post('/hotel')
      .set('Accept', 'application/json')
      .send(payload)
      .then(function(res){
        request(server)
          .put('/hotel/1')
          .set('Accept', 'application/json')
          .send(payload2)
          .expect(200)
          .expect(payload2, done);
      })
  });

  it('responds with a 405 when attempting to update a hotel that does not exist', function testUpdatingNonExistantBooking(done){
      request(server)
        .put('/hotel/100000')
        .set('Accept', 'application/json')
        .send(payload2)
        .expect(405, done);
  })

});
