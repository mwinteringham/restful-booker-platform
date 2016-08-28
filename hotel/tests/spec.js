var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    mongoose     = require('mongoose'),
    booking      = require('../../booking/models/booking.js'),
    assert       = require('assert');

mongoose.createConnection('mongodb://localhost/restful-booker-platform');

var generatePayload = function(hotelName, addressDetails, registrationDate, contactName, phoneNumber, emailAddress){
  return {
    name : hotelName,
    address : addressDetails,
    regdate : registrationDate,
    contact : {
      name : contactName,
      phone : phoneNumber,
      email : emailAddress
    }
  }
};

var payload = generatePayload('hotel one', '28 Street, Avenue place, city, SG1 8KA', '2014-01-01', 'Mark owner', '01938 938192', 'test@email.com'),
    payload2 = generatePayload('hotel two', 'One Street, Avenue place, city, SG2 9JA', '2014-01-01', 'Geoff owner', '01938 281931', 'fake@email.com');

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
    var token;

    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .post('/hotel')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + res.body.token)
          .send(payload)
          .expect(200)
          .expect(function(res){
            res.body.hotelid.should.equal(1);
            res.body.hotel.should.deep.equal({
              'name' : 'hotel one',
              'address' : '28 Street, Avenue place, city, SG1 8KA',
              'regdate' : '2014-01-01T00:00:00.000Z',
              'contact' : {
                'name' : 'Mark owner',
                'phone' : '01938 938192',
                'email' : 'test@email.com'
              }
            })
          })
          .end(done)
      })
  });

  it('responds with a 500 error when a bad payload is sent', function testCreateBadBooking(done){
    badpayload = { 'badname': 'name'}

    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .post('/hotel')
          .set('Cookie', 'token=' + res.body.token)
          .send(badpayload)
          .expect(500)
          .end(done)
      })
  });

  it('responds with a 200 when a payload with too many params are sent', function testCreateExtraPayload(done){
    var extraPayload = generatePayload('hotel two', 'One Street, Avenue place, city, SG2 9JA', '2014-01-01', 'Geoff owner', '01938 281931', 'fake@email.com')
    extraPayload.extra = 'bad'

    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .post('/hotel')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + res.body.token)
          .send(extraPayload)
          .expect(200)
          .end(done)
      })
  });

  it('should respond with a 418 when using a bad accept header', function(done){
    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .post('/hotel')
          .set('Accept', 'application/ogg')
          .set('Cookie', 'token=' + res.body.token)
          .send(payload)
          .expect(418)
          .end(done)
      })
  });

});

describe('restful-booker-platform GET /hotel', function(){

  beforeEach(function(){
    mongoose.connection.db.dropDatabase();
  });

  it('should respond with a 200 and a list of hotels when calling /hotel', function(done){
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
          .post('/hotel')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + token)
          .send(payload)
      })
      .then(function(){
        return request(server)
          .post('/hotel')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + token)
          .send(payload2)
      })
      .then(function(){
        request(server)
          .get('/hotel')
          .expect(function(res){
            res.body.should.deep.equal([
              {
                'hotelid' : 1,
                'name' : 'hotel one',
                'address' : '28 Street, Avenue place, city, SG1 8KA',
                'regdate' : '2014-01-01T00:00:00.000Z',
                'contact' : {
                  'name' : 'Mark owner',
                  'phone' : '01938 938192',
                  'email' : 'test@email.com'
                }
              },{
                'hotelid' : 2,
                'name' : 'hotel two',
                'address' : 'One Street, Avenue place, city, SG2 9JA',
                'regdate' : '2014-01-01T00:00:00.000Z',
                'contact' : {
                  'name' : 'Geoff owner',
                  'phone' : '01938 281931',
                  'email' : 'fake@email.com'
                }
              }
            ]);
          })
          .end(done)
      })
  })

});

describe('restful-booker-platform GET /hotel/:id', function(){

  beforeEach(function(){
    mongoose.connection.db.dropDatabase();
  });

  it('should respond with a 200 and payload when getting a hotel resource', function(done){
    var token;

    var bookingPayload = {
      "hotelid": 1,
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
      "hotelid": 1,
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

    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        return token = res.body.token
      }).then(function(){
        return request(server)
          .post('/hotel')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + token)
          .send(payload)
      })
      .then(function(res){
        booking.create(bookingPayload, function(){
          booking.create(bookingPayload2, function(){
            request(server)
              .get('/hotel/1')
              .set('Accept', 'application/json')
              .expect(200)
              .expect(function(res){
                res.body.should.deep.equal({
                  'name' : 'hotel one',
                  'address' : '28 Street, Avenue place, city, SG1 8KA',
                  'regdate' : '2014-01-01T00:00:00.000Z',
                  'contact' : {
                    'name' : 'Mark owner',
                    'phone' : '01938 938192',
                    'email' : 'test@email.com'
                  },
                  "bookings": [{
                    "hotelid": 1,
                    "bookingid": 2,
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
                    "hotelid": 1,
                    "bookingid": 3,
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
    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .post('/hotel')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + res.body.token)
          .send(payload)
          .then(function(){
            request(server)
              .get('/hotel/1')
              .expect(418, done);
          })
      })
  });

  it('should respond with a 404 when getting a hotel that doesn\'t exist', function(done){
      request(server)
        .get('/hotel/10000000')
        .expect(404, done);
  });

});

describe('restful-booker-platform DELETE /hotel', function(){

  it('responds with a 201 when deleting an existing booking', function(done){
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
          .post('/hotel')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + token)
          .send(payload)
      })
      .then(function(res){
        request(server)
          .delete('/hotel/' + res.body.hotelid)
          .set('Cookie', 'token=' + token)
          .expect(201, done)
      })
  });

  it('responds with a 405 when deleting a booking that doesn\'t exist', function(done){
    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .delete('/hotel/10000000')
          .set('Cookie', 'token=' + res.body.token)
          .expect(405)
          .end(done)
      })
  });

});

describe('restful-booker-platform PUT /hotel', function(){

  it('responds with a 200 and an updated payload', function(done){
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
          .post('/hotel')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + token)
          .send(payload)
      })
      .then(function(res){
        request(server)
          .put('/hotel/2')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + token)
          .send(payload2)
          .expect(200)
          .expect(function(res){
            res.body.should.deep.equal({
              'name' : 'hotel two',
              'address' : 'One Street, Avenue place, city, SG2 9JA',
              'regdate' : '2014-01-01T00:00:00.000Z',
              'contact' : {
                'name' : 'Geoff owner',
                'phone' : '01938 281931',
                'email' : 'fake@email.com'
              }
            })
          })
          .end(done)
      })
  });

  it('responds with a 405 when attempting to update a hotel that does not exist', function testUpdatingNonExistantBooking(done){
    request('http://localhost:3004')
      .post('/auth')
      .send({
        'username' : 'admin',
        'password' : 'password'
      })
      .then(function(res){
        request(server)
          .put('/hotel/100000')
          .set('Accept', 'application/json')
          .set('Cookie', 'token=' + res.body.token)
          .send(payload2)
          .expect(405)
          .end(done)
      })
  })

});
