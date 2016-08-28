var request      = require('supertest-as-promised'),
    expect       = require('chai').expect,
    should       = require('chai').should(),
    assert       = require('assert');

var server = require('../app')

describe('restful-booker-platform - /auth', function () {

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

describe('restful-booker-platform - POST /auth', function () {

  it('responds with a 200 and set-cookie header when logging in with correct credentials', function(done){
    request(server)
      .post('/auth')
      .set('Accept', 'application/json')
      .send({
        "username": "admin",
        "password": "password"
      })
      .expect(200)
      .expect(function(res){
        should.exist(res.body.token)
      })
      .end(done)
  });

  it('responds with a 403 and no set-cookie header when loggin in with incorrect credentials', function(done){
    request(server)
      .post('/auth')
      .send({
        "username": "nimda",
        "password": "drowssap"
      })
      .expect(403)
      .end(done)
  });

});

describe('restful-booker-platform - POST /validate', function () {

  it('responds with a 200 when checking to see if a token is valid', function(done){
    request(server)
      .post('/auth')
      .send({
        "username": "admin",
        "password": "password"
      })
      .then(function(res){
          request(server)
            .post('/validate')
            .send({"token" : res.body.token})
            .expect(200, done)
      });
  });

  it('responds with a 403 when checking to see if an invalid token exists', function(done){
    request(server)
      .post('/validate')
      .send({"token" : 'badtoken'})
      .expect(403, done)
  });

});

describe('restful-booker-platform - POST /logout', function () {

  it('respond with a 200 and the token is removed when calling logout', function(done){
    var tokenToUse;

    request(server)
      .post('/auth')
      .send({
        "username": "admin",
        "password": "password"
      })
      .then(function(res){
          return tokenToUse = res.body.token;
      })
      .then(function(){
        return request(server)
          .post('/logout')
          .send({"token" : tokenToUse})
          .expect(200)
      })
      .then(function(){
        request(server)
          .post('/validate')
          .send({"token" : tokenToUse})
          .expect(403)
          .end(done)
      });
  });

});
