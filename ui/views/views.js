var Mustache = require('mustache'),
    fs      = require('fs');
    header  = fs.readFileSync(__dirname + '/../static/header.html'),
    footer  = fs.readFileSync(__dirname + '/../static/footer.html');

exports.index = function(view, callback){
  var index = '<ul>{{#.}}<li>{{name}}</li>{{/.}}</ul>';

  callback(header + Mustache.render(index, view) + footer);
}
