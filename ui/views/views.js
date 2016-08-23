var Mustache = require('mustache'),
    fs      = require('fs');
    header  = fs.readFileSync(__dirname + '/../fixtures/header.html'),
    footer  = fs.readFileSync(__dirname + '/../fixtures/footer.html');

exports.index = function(view, callback){

  var hotelsList = '<div class="row"><div class="col-sm-12">Hotel name</div></div>' +
                   '<div class="row">' +
                   '{{#.}}<div class="col-sm-12">{{name}}</div>{{/.}}' +
                   '</div>';

  var createHotelForm = '<div class="row">' +
                        '<div class="col-sm-11"><input type="text" id="hotelName" /></div>' +
                        '<div class="col-sm-1"><input type="button" value="Create" id="createHotel"/></div>' +
                        '</div>';

  callback(header + Mustache.render(hotelsList + createHotelForm, view) + footer);
}
