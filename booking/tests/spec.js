var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    mongoose     = require('mongoose'),
    assert       = require('assert'),
    xml2js       = require('xml2js').parseString;

mongoose.createConnection('mongodb://localhost/restful-booker-platform');

var generatePayload = function(firstname, lastname, totalprice, depositpaid, additionalneeds, checkin, checkout){
  var payload = {
      'hotelid': 1,
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

var payload  = generatePayload('Sally', 'Brown', 111, true, 'Breakfast', '2013-02-01', '2013-02-04'),
    payload2 = generatePayload('Geoff', 'White', 111, true, 'Breakfast', '2013-02-02', '2013-02-05')

var server = require('../app')

describe('restful-booker-platform - /booking', function () {

  beforeEach(function(){
    mongoose.connection.db.dropDatabase();
  })

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

describe('restful-booker-platform - POST /booking', function () {
  beforeEach(function(){
    mongoose.connection.db.dropDatabase();
  })

  it('responds with the created booking and assigned booking id', function testCreateBooking(done){
    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .post('/booking')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + res.body.token)
          .send(payload)
          .expect(200)
          .expect(function(res){
            res.body.bookingid.should.equal(1);
            res.body.booking.should.deep.equal(payload);
          })
          .end(done)
      })
  });

  it('responds with a 500 error when a bad payload is sent', function testCreateBadBooking(done){
    badpayload = { 'lastname': 'Brown', 'totalprice': 111, 'depositpaid': true, 'additionalneeds': 'Breakfast'}

    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .post('/booking')
          .set('Cookie', 'token=' + res.body.token)
          .send(badpayload)
          .expect(500, done);
      });
  });

  it('responds with a 200 when a payload with too many params are sent', function testCreateExtraPayload(done){
    var extraPayload = payload
    extraPayload.extra = 'bad'

    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .post('/booking')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + res.body.token)
          .send(extraPayload)
          .expect(200, done);
      })
  });

  it('responds with a 418 when using a bad accept header', function testTeapot(done){
    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .post('/booking')
          .set('Accept', 'application/ogg')
          .set('Cookie', 'token=' + res.body.token)
          .send(payload)
          .expect(418, done)
      });
  })
});

describe('restful-booker-platform POST /booking - multiple bookings', function(){
  beforeEach(function(){
    mongoose.connection.db.dropDatabase();
  })

  it('responds with the correct assigned booking id when multiple payloads are sent', function testBookingId(done){
    var token;
    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        return token = res.body.token
      })
      .then(function(){
        return request(server)
          .post('/booking')
          .set('Cookie', 'token=' + token)
          .send(payload)
      })
      .then(function(){
        request(server)
          .post('/booking')
          .send(payload2)
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + token)
          .expect(200)
          .expect(function(res) {
            res.body.bookingid.should.equal(2);
          })
          .end(done)
      });
  });

});

describe('restful-booker-platform - PUT /booking', function () {

  it('responds with a 200 and an updated payload', function testUpdatingABooking(done){
    var token;

    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        return token = res.body.token;
      })
      .then(function(){
        return request(server)
          .post('/booking')
          .set('Cookie', 'token=' + token)
          .send(payload)
      })
      .then(function(){
        request(server)
          .put('/booking/1')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + token)
          .send(payload2)
          .expect(200)
          .expect(payload2)
          .end(done);
      });
  });

  it('responds with a 200 and an updated payload using auth', function testUpdatingABooking(done){
    var token;

    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        return token = res.body.token;
      })
      .then(function(){
        return request(server)
          .post('/booking')
          .set('Cookie', 'token=' + token)
          .send(payload)
      })
      .then(function(){
        request(server)
          .put('/booking/1')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + token)
          .send(payload2)
          .expect(200)
          .expect(payload2)
          .end(done)
      })
  });

  it('responds with a 405 when attempting to update a booking that does not exist', function testUpdatingNonExistantBooking(done){
    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .put('/booking/100000')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + res.body.token)
          .send(payload2)
          .expect(405, done);
      })
  });

});

describe('restful-booker-platform DELETE /booking', function(){

  it('responds with a 201 when deleting an existing booking', function testDeletingAValidBooking(done){
    var token;

    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        return token = res.body.token;
      })
      .then(function(){
        return request(server)
          .post('/booking')
          .set('Cookie', 'token=' + token)
          .send(payload)
      })
      .then(function(){
        return request(server)
          .delete('/booking/1')
          .set('Cookie', 'token=' + token)
          .expect(201)
      }).then(function(){
        request(server)
          .get('/booking/1')
          .expect(404)
          .end(done)
      });
  });

  it('responds with a 201 when deleting an existing booking with a basic auth header', function testDeletingAValidBookingWithAuth(done){
    var token;

    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        return token = res.body.token;
      })
      .then(function(){
        return request(server)
          .post('/booking')
          .set('Cookie', 'token=' + token)
          .send(payload)
      })
      .then(function(){
        return request(server)
          .delete('/booking/2')
          .set('Cookie', 'token=' + token)
          .expect(201)
      })
      .then(function(){
        request(server)
          .get('/booking/2')
          .expect(404)
          .end(done)
      });
  });

  it('responds with a 405 when deleting a non existing booking', function testDeletingNonExistantBooking(done){
    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .delete('/booking/1')
          .set('Cookie', 'token=' + res.body.token)
          .expect(405, done)
      })
  });

});
