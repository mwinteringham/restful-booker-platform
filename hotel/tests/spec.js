var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    mongoose     = require('mongoose'),
    js2xmlparser = require("js2xmlparser"),
    assert       = require('assert'),
    xml2js       = require('xml2js').parseString;

mongoose.createConnection('mongodb://localhost/restful-booker-platform');

var generatePayload = function(hotelName){
  return {
    name: hotelName
  }
};

var payload = generatePayload('hotel one');

var server = require('../app')

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
  })

});
