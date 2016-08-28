var Mustache = require('mustache'),
    fs      = require('fs');
    header  = fs.readFileSync(__dirname + '/../fixtures/header.html'),
    footer  = fs.readFileSync(__dirname + '/../fixtures/footer.html');

exports.index = function(view, callback){

  var hotelsList = '<div class="row">' +
                   '<div class="col-sm-2 rowHeader"><p>Hotel name</p></div>' +
                   '<div class="col-sm-2 rowHeader"><p>Address</p></div>' +
                   '<div class="col-sm-2 rowHeader"><p>Owner</p></div>' +
                   '<div class="col-sm-2 rowHeader"><p>Phone number</p></div>' +
                   '<div class="col-sm-2 rowHeader"><p>Email</p></div>' +
                   '<div class="col-sm-2"></div>' +
                   '</div>' +
                   '{{#.}}' +
                   '<div class="row hotelRow">' +
                   '<div class="col-sm-2"><p>{{name}}</p></div>' +
                   '<div class="col-sm-2"><p>{{address}}</p></div>' +
                   '<div class="col-sm-2"><p>{{contact.name}}</p></div>' +
                   '<div class="col-sm-2"><p>{{contact.phone}}</p></div>' +
                   '<div class="col-sm-2"><p>{{contact.email}}</p></div>' +
                   '<div class="col-sm-2">' +
                   '<span class="glyphicon glyphicon-remove hotelDelete" id="{{hotelid}}"></span>' +
                   '<input type="hidden" id="{{hotelid}}" />' +
                   '</div>' +
                   '</div>' +
                   '{{/.}}';


  var createHotelForm = '<div class="row">' +
                        '<div class="col-sm-2"><input type="text" id="hotelName" /></div>' +
                        '<div class="col-sm-2"><input type="text" id="address" /></div>' +
                        '<div class="col-sm-2"><input type="text" id="owner" /></div>' +
                        '<div class="col-sm-2"><input type="text" id="phone" /></div>' +
                        '<div class="col-sm-2"><input type="text" id="email" /></div>' +
                        '<div class="col-sm-2"><input type="button" value="Create" id="createHotel"/></div>' +
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

  var hotelInfo = '<div class="well">' +
                  '<div class="container-fluid">' +
                  '<div class="row">' +
                  '<div class="col-sm-6">' +
                  '<h2>{{name}}<span class="glyphicon glyphicon-pencil hotelEdit" style="margin-left: 5px; font-size: 0.5em"></span>'+
                  '</h2><p>Address: <span>{{address}}</span></p><p>Registration date: <span>{{#formatDate}}{{regdate}}{{/formatDate}}</span></p>' +
                  '</div>' +
                  '<div class="col-sm-6">' +
                  '<br /><br /><br /><p>Owner: <span>{{contact.name}}</span></p><p>Phone: <span>{{contact.phone}}</span></p><p>Email: <span>{{contact.email}}</span></p>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '</div>';

  var bookingsList = '<div class="row">' +
                     '<div class="col-sm-2 rowHeader"><p>First name</p></div>' +
                     '<div class="col-sm-2 rowHeader"><p>Last name</p></div>' +
                     '<div class="col-sm-1 rowHeader"><p>Price</p></div>' +
                     '<div class="col-sm-2 rowHeader"><p>Deposit paid?</p></div>' +
                     '<div class="col-sm-2 rowHeader"><p>Check in</p></div>' +
                     '<div class="col-sm-2 rowHeader"><p>Check out</p></div>' +
                     '<div class="col-sm-1"></div>' +
                     '</div>' +
                     '{{#bookings}}' +
                     '<div class="row">' +
                     '<div class="col-sm-2"><p>{{firstname}}</p></div>' +
                     '<div class="col-sm-2"><p>{{lastname}}</p></div>' +
                     '<div class="col-sm-1"><p>{{totalprice}}</p></div>' +
                     '<div class="col-sm-2"><p>{{depositpaid}}</p></div>' +
                     '<div class="col-sm-2"><p>{{#formatDate}}{{bookingdates.checkin}}{{/formatDate}}</p></div>' +
                     '<div class="col-sm-2"><p>{{#formatDate}}{{bookingdates.checkout}}{{/formatDate}}</p></div>' +
                     '<div class="col-sm-1">' +
                     '<input type="hidden" value="{{bookingid}}"/>' +
                     '<span class="glyphicon glyphicon-pencil bookingEdit"></span> ' +
                     '<span class="glyphicon glyphicon-trash bookingDelete" id="{{bookingid}}"></span>' +
                     '</div>' +
                     '</div>' +
                     '{{/bookings}}' +
                     '<div class="row">' +
                     '<div class="col-sm-2"><input type="text" id="firstName" /></div>' +
                     '<div class="col-sm-2"><input type="text" id="lastName" /></div>' +
                     '<div class="col-sm-1"><input type="text" id="totalPrice" /></div>' +
                     '<div class="col-sm-2">' +
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

exports.search = function(searchResults, callback){
  searchResults.formatDate = function() {
    return function(rawDate, render) {
      var completeDate = render(rawDate);
      return completeDate.split('T')[0];
    }
  }

  var searchHeading = '<div class="row">' +
                      '<div class="col-sm-12">' +
                      '<div class="well"><h2>Search results</h2></div>' +
                      '</div>' +
                      '</div>';

  var hotelResults = '<div class="row">' +
                     '<div class="col-sm-12">' +
                     '<h3>Hotel Results</h3>' +
                     '</div>' +
                     '</div>' +
                     '{{#hotels}}' +
                     '{{#.}}' +
                     '<div class="row">' +
                     '<div class="col-sm-12 searchResult"><input type="hidden" value="{{hotelid}}"></p>{{name}}</p></div>' +
                     '</div>' +
                     '{{/.}}' +
                     '{{/hotels}}';

   var bookingResults = '<div class="row">' +
                        '<div class="col-sm-12">' +
                        '<h3>Booking Results</h3>' +
                        '</div>' +
                        '</div>' +
                        '{{#bookings}}' +
                        '{{#.}}' +
                        '<div class="row">' +
                        '<div class="col-sm-8 searchResult"><input type="hidden" value="{{hotelid}}?bookingid={{bookingid}}" /><p>{{firstname}} {{lastname}}<p></div>' +
                        '<div class="col-sm-2" style="text-align: center"><p>{{#formatDate}}{{bookingdates.checkin}}{{/formatDate}}</p></div>' +
                        '<div class="col-sm-2" style="text-align: center"><p>{{#formatDate}}{{bookingdates.checkout}}{{/formatDate}}</p></div>' +
                        '</div>' +
                        '</div>' +
                        '{{/.}}' +
                        '{{/bookings}}';

  callback(header + Mustache.render(searchHeading + hotelResults + bookingResults, searchResults) + footer)
}
