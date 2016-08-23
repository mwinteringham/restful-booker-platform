var express = require('express');
var router  = express.Router(),
    request = require('request'),
    view    = require('../views/views');

router.get('/ping', function(req, res) {
  res.sendStatus(201);
});

router.get('/', function(req, res){
  request('http://localhost:3001/hotel', function(error, response, body){
    view.index(JSON.parse(response.body), function(render){
      res.send(render);
    });
  });
});

module.exports = router;
