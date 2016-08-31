function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$( document ).ready(function() {

    $('body').on('focus', '.datepicker', function(){
        $(this).datepicker({ dateFormat: 'yy-mm-dd' })
    })

    if(getUrlVars()['bookingid']){
      $( "#" + getUrlVars()['bookingid']).closest(".row").css('color', 'red');
    }

    $( '#search' ).keypress(function(e) {
      if(e.which == 13) {
        window.location.href = '/search?keyword=' + $( '#search' ).val();
      }
    });

    $('body').on('click', '.hotelRow', function(){
      window.location.href = '/hotel/' + $(this).parent().find('input').attr('id');
    });

    $( "#createHotel" ).click(function() {
      if(hotelName){
        var payload = {
          name: $( "#hotelName" ).val(),
          address: $( "#address" ).val(),
          regdate: new Date(),
          contact: {
            name: $( "#owner" ).val(),
            phone: $( "#phone" ).val(),
            email: $( "#email" ).val()
          }
        };

        $.ajax({
          method: "POST",
          url: "http://" + document.domain + ":3001/hotel",
          data: JSON.stringify(payload),
          dataType: "json",
          contentType: "application/json;charset=utf-8",
          xhrFields: {
             withCredentials: true
          },
          headers: {
            "Accept": "application/json"
          }
        })
        .done(function( msg ) {
          location.reload();
        });
      }
    });

    $('body').on('click', '.hotelEdit', function(){
      var hotelHtml = $(this).closest('.row');
      var rows = $(hotelHtml).find('p > span');

      var editHotel = '<div class="col-sm-6">' +
                      '  <h2><input type="text" placeholder="' + $(hotelHtml).find('h2')[0].textContent + '" style="width: 90%"/>' +
                      '  <span class="glyphicon glyphicon-ok confirmHotelEdit" style="font-size: 0.5em"></span>' +
                      '  <span class="glyphicon glyphicon-remove exitHotelEdit" style="font-size: 0.5em"></span>' +
                      '  </h2>' +
                      '  <p>Address: <input type="text" placeholder="' + rows[0].textContent + '" /></p>' +
                      '  <p>Registration date: <span>2014-01-01</span></p>' +
                      '</div><div class="col-sm-6">' +
                      '<br><br><br>' +
                      '  <p>Owner: <input type="text" placeholder="' + rows[2].textContent + '" /></p>' +
                      '  <p>Phone: <input type="text" placeholder="' + rows[3].textContent + '" /></p>' +
                      '  <p>Email: <input type="text" placeholder="' + rows[4].textContent + '" /></p>' +
                      '</div>';

      $(this).closest('.row').html(editHotel);
    });

    $('body').on('click', '.exitHotelEdit', function(){
      var hotelHtml = $(this).closest('.row');
      var rows = $(hotelHtml).find('input');

      var resumeHotel = '<div class="col-sm-6">' +
                        '<h2>' + $(rows[0]).attr('placeholder') + '<span class="glyphicon glyphicon-pencil hotelEdit" style="margin-left: 5px; font-size: 0.5em"></span></h2>' +
                        '<p>Address: <span>' + $(rows[1]).attr('placeholder') + '</span></p>' +
                        '<p>Registration date: <span>' + $(hotelHtml).find('p > span')[0].textContent + '</span></p>' +
                        '</div>' +
                        '<div class="col-sm-6">' +
                        '<br><br><br>' +
                        '<p>Owner: <span>' + $(rows[2]).attr('placeholder') + '</span></p>' +
                        '<p>Phone: <span>' + $(rows[3]).attr('placeholder') + '</span></p>' +
                        '<p>Email: <span>' + $(rows[4]).attr('placeholder') + '</span></p>' +
                        '</div>';

      $(this).closest('.row').html(resumeHotel);
    });

    $('body').on('click', '.confirmHotelEdit', function(){
      var hotelHtml = $(this).closest('.row');
      var rows = $(hotelHtml).find('input');
      var id = $('#hotelId').val()

      var returnValOrPlaceholder = function(index){
        if($(rows[index]).val() == ""){
          return $(rows[index]).attr('placeholder');
        } else {
          return $(rows[index]).val();
        }
      }

      var payload = {
          "hotelid": id,
          "name" : returnValOrPlaceholder(0),
          "address" : returnValOrPlaceholder(1),
          "regdate" : $(hotelHtml).find('p > span')[0].textContent,
          "contact" : {
              "name" : returnValOrPlaceholder(2),
              "phone" : returnValOrPlaceholder(3),
              "email" : returnValOrPlaceholder(4)
          }
      }

      $.ajax({
        method: "PUT",
        url: "http://" + document.domain + ":3001/hotel/" + id,
        data: JSON.stringify(payload),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
           withCredentials: true
        },
        headers: {"Accept": "application/json"}
      })
      .done(function( msg ) {
        location.reload();
      });
    });

    $( ".hotelDelete" ).click(function(){
      var id = $(this).attr('id');

      $.ajax({
        method: "DELETE",
        url: "http://" + document.domain + ":3001/hotel/" + id,
        xhrFields: {
           withCredentials: true
        }
      })
      .done(function( msg ) {
        location.reload();
      });
    });

    $( "#createBooking" ).click(function(){
      var payload = {
          "hotelid": $( "#hotelId" ).val(),
          "firstname" : $( "#firstName" ).val(),
          "lastname" : $( "#lastName" ).val(),
          "totalprice" : $( "#totalPrice" ).val(),
          "depositpaid" : $( "#depositPaid" ).val(),
          "bookingdates" : {
              "checkin" : $( "#checkIn" ).val(),
              "checkout" : $( "#checkOut" ).val()
          }
      }

      $.ajax({
        method: "POST",
        url: "http://" + document.domain + ":3000/booking",
        data: JSON.stringify(payload),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        headers: {"Accept": "application/json"},
        xhrFields: {
           withCredentials: true
        }
      })
      .done(function( msg ) {
        location.reload();
      });
    });

    $('body').on('click', '.bookingEdit', function(){
      var rows = $(this).parent().siblings();
      var id = $(this).siblings('input').val();

      var generateSelectList = function(content){
        if(content == "true"){
          return '<option value="false">false</option><option value="true" selected>true</option>'
        } else {
          return '<option value="false" selected>false</option><option value="true">true</option>'
        }
      }

      var newRow = '<div class="col-sm-2"><input type="text" placeholder="' + rows[0].textContent + '" /></div>' +
                   '<div class="col-sm-2"><input type="text" placeholder="' + rows[1].textContent + '" /></div>' +
                   '<div class="col-sm-1"><input type="text" placeholder="' + rows[2].textContent + '" /></div>' +
                   '<div class="col-sm-2">' +
                   '<input type="hidden" value="' + rows[3].textContent + '" />' +
                   '<select>' + generateSelectList(rows[3].textContent) + '</select>' +
                   '</div>' +
                   '<div class="col-sm-2"><input type="text" class="datepicker" placeholder="' + rows[4].textContent + '" /></div>' +
                   '<div class="col-sm-2"><input type="text" class="datepicker" placeholder="' + rows[5].textContent + '" /></div>' +
                   '<div class="col-sm-1">' +
                   '<input type="hidden" value="' + id + '"/>' +
                   '<span class="glyphicon glyphicon-ok confirmBookingEdit"></span> ' +
                   '<span class="glyphicon glyphicon-remove exitBookingEdit"></span>' +
                   '</div>';

      $(this).closest(".row").html(newRow);
    });

    $('body').on('click', '.confirmBookingEdit', function(){
      var id = $(this).siblings('input').val();
      var rows = $(this).parent().siblings();

      var returnValOrPlaceholder = function(index){
        if($(rows[index]).children('input').val() == ""){
          return $(rows[index]).children('input').attr('placeholder');
        } else {
          return $(rows[index]).children('input').val();
        }
      }

      var payload = {
          "hotelid": $('#hotelId').val(),
          "firstname" : returnValOrPlaceholder(0),
          "lastname" : returnValOrPlaceholder(1),
          "totalprice" : returnValOrPlaceholder(2),
          "depositpaid" : $(rows[3]).children('select').val(),
          "bookingdates" : {
              "checkin" : returnValOrPlaceholder(4),
              "checkout" : returnValOrPlaceholder(5)
          }
      }

      $.ajax({
        method: "PUT",
        url: "http://" + document.domain + ":3000/booking/" + id,
        data: JSON.stringify(payload),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        headers: {"Accept": "application/json"},
        xhrFields: {
           withCredentials: true
        }
      })
      .done(function( msg ) {
        location.reload();
      });
    });

    $('body').on('click', '.exitBookingEdit', function(){
      var rows = $(this).parent().siblings();
      var id = $(this).siblings('input').val();

      var newRow = '<div class="col-sm-2"><p>' + $(rows[0]).children('input').attr('placeholder') + '</p></div>' +
                   '<div class="col-sm-2"><p>' + $(rows[1]).children('input').attr('placeholder') + '</p></div>' +
                   '<div class="col-sm-1"><p>' + $(rows[2]).children('input').attr('placeholder') + '</p></div>' +
                   '<div class="col-sm-2"><p>' + $(rows[3]).children('input').val() + '</p></div>' +
                   '<div class="col-sm-2"><p>' + $(rows[4]).children('input').attr('placeholder') + '</p></div>' +
                   '<div class="col-sm-2"><p>' + $(rows[5]).children('input').attr('placeholder') + '</p></div>' +
                   '<div class="col-sm-1">' +
                   '<input type="hidden" value="' + id + '"/>' +
                   '<span class="glyphicon glyphicon-pencil bookingEdit"></span> ' +
                   '<span class="glyphicon glyphicon-trash bookingDelete"></span>' +
                   '</div>';

      $(this).closest(".row").html(newRow);
    });

    $('body').on('click', '.bookingDelete', function(){
      var id = $(this).siblings('input').val();

      $.ajax({
        method: "DELETE",
        url: "http://" + document.domain + ":3000/booking/" + id,
        xhrFields: {
           withCredentials: true
        }
      })
      .done(function( msg ) {
        location.reload();
      });
    });

    $('body').on('click', '.searchResult', function(){
      window.location.href = '/hotel/' + $(this).find('input')[0].defaultValue;
    });

    $('body').on('click', '#doLogin', function(){
      var username = $('#username').val()
      var password = $('#password').val()

      if(username != "" && password != ""){
        $.ajax({
          method: "POST",
          url: "http://" + document.domain + ":3004/auth",
          data: JSON.stringify({
            "username" : username,
            "password" : password
          }),
          contentType: "application/json",
          xhrFields: {
             withCredentials: true
          },
          success: function(data, textStatus, request){
            Cookies.set("token", data.token);

            location.reload();
          },
          error: function (request, textStatus, errorThrown) {
            $('#username').css('border','1px solid red');
            $('#password').css('border','1px solid red');
          }
        });
      }
    });

    $('body').on('click', '#logout', function(){
      Cookies.remove('token');

      location.reload();
    });
});
