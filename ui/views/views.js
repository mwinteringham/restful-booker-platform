var Mustache = require('mustache'),
    fs      = require('fs');
    header  = fs.readFileSync(__dirname + '/../fixtures/header.html'),
    footer  = fs.readFileSync(__dirname + '/../fixtures/footer.html');

exports.index = function(view, callback){

  var hotelsList = '<div class="row">' +
                   '<div class="col-sm-12"><p>Hotel name</p></div>' +
                   '</div>' +
                   '<div class="row">' +
                   '{{#.}}' +
                   '<div class="col-sm-11"><a href="/hotel/{{hotelid}}">{{name}}</a></div>' +
                   '<div class="col-sm-1"><span class="glyphicon glyphicon-remove hotelDelete" id="{{hotelid}}"></span></div>' +
                   '{{/.}}' +
                   '</div>';

  var createHotelForm = '<div class="row">' +
                        '<div class="col-sm-11"><input type="text" id="hotelName" /></div>' +
                        '<div class="col-sm-1"><input type="button" value="Create" id="createHotel"/></div>' +
                        '</div>';

  callback(header + Mustache.render(hotelsList + createHotelForm, view) + footer);
}

exports.hotel = function(view, callback){
  view.formatDate = function() {
    return function(rawDate, render) {
      var completeDate = render(rawDate);
      return completeDate.split('T')[0];
    }
  }

  var hotelInfo = '<div class="row">' +
                  '<div class="col-sm-12">{{name}}</div>' +
                  '</div>';

  var bookingsList = '<div class="row">' +
                     '<div class="col-sm-2"><p>First name</p></div>' +
                     '<div class="col-sm-2"><p>Last name</p></div>' +
                     '<div class="col-sm-1"><p>Total price</p></div>' +
                     '<div class="col-sm-1"><p>Deposit paid?</p></div>' +
                     '<div class="col-sm-2"><p>Check in</p></div>' +
                     '<div class="col-sm-2"><p>Check out</p></div>' +
                     '<div class="col-sm-1"></div>' +
                     '</div>' +
                     '{{#bookings}}' +
                     '<div class="row">' +
                     '<div class="col-sm-2"><p>{{firstname}}</p></div>' +
                     '<div class="col-sm-2"><p>{{lastname}}</p></div>' +
                     '<div class="col-sm-1"><p>{{totalprice}}</p></div>' +
                     '<div class="col-sm-1"><p>{{depositpaid}}</p></div>' +
                     '<div class="col-sm-2"><p>{{#formatDate}}{{bookingdates.checkin}}{{/formatDate}}</p></div>' +
                     '<div class="col-sm-2"><p>{{#formatDate}}{{bookingdates.checkout}}{{/formatDate}}</p></div>' +
                     '<div class="col-sm-1">' +
                     '<input type="hidden" value="{{bookingid}}"/>' +
                     '<span class="glyphicon glyphicon-pencil bookingEdit"></span> ' +
                     '<span class="glyphicon glyphicon-trash bookingDelete"></span>' +
                     '</div>' +
                     '</div>' +
                     '{{/bookings}}' +
                     '<div class="row">' +
                     '<div class="col-sm-2"><input type="text" id="firstName" /></div>' +
                     '<div class="col-sm-2"><input type="text" id="lastName" /></div>' +
                     '<div class="col-sm-1"><input type="text" id="totalPrice" /></div>' +
                     '<div class="col-sm-1">' +
                     '<select id="depositPaid" />' +
                     '<option value="false">false</option>' +
                     '<option value="true">true</option>' +
                     '</select>' +
                     '</div>' +
                     '<div class="col-sm-2"><input type="text" id="checkIn" /></div>' +
                     '<div class="col-sm-2"><input type="text" id="checkOut" /></div>' +
                     '<div class="col-sm-1"><input type="button" id="createBooking" value="Create"><input type="hidden" id="hotelId" value="{{hotelid}}"></div>' +
                     '</div>';


  callback(header + Mustache.render(hotelInfo + bookingsList, view) + footer);
}
