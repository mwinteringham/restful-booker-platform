var express = require('express');
var router  = express.Router(),
    tokens  = [];

router.get('/ping', function(req, res) {
  res.sendStatus(201);
});

router.post('/auth', function(req, res){
  if(req.body.username == "admin" && req.body.password == "password"){
    var token = Math.random().toString(36).substr(2);
    tokens.push(token);

    res.send({'token': token});
  } else {
    res.sendStatus(403);
  }
});

router.post('/validate', function(req, res){
  if(tokens.indexOf(req.body.token) > -1){
      res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

router.post('/logout', function(req, res){
  tokens.splice(tokens.indexOf(req.body.token), 1)

  res.sendStatus(200);
})

module.exports = router;
