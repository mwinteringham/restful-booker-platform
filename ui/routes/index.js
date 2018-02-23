var express = require('express');
var router  = express.Router();

router.get('/ping', function(req, res) {
  res.sendStatus(201);
});

router.get('/', function(req, res){
  res.sendFile('../public/index.html')
});

module.exports = router;
