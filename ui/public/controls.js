$( document ).ready(function() {

    $( '#search' ).keypress(function(e) {
      if(e.which == 13) {
        window.location.href = '/search?keyword=' + $( '#search' ).val();
      }
    });

    $( "#createHotel" ).click(function() {
      var hotelName = $( "#hotelName" ).val();

      if(hotelName){
        $.ajax({
          method: "POST",
          url: "http://localhost:3001/hotel",
          data: { name: hotelName}
        })
        .done(function( msg ) {
          location.reload();
        });
      }
    });

    $( ".hotelDelete" ).click(function(){
      var id = $(this).attr('id');

      $.ajax({
        method: "DELETE",
        url: "http://localhost:3001/hotel/" + id
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
        url: "http://localhost:3000/booking",
        data: JSON.stringify(payload),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        headers: {"Accept": "application/json"}
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
                   '<div class="col-sm-2"><input type="text" placeholder="' + rows[4].textContent + '" /></div>' +
                   '<div class="col-sm-2"><input type="text" placeholder="' + rows[5].textContent + '" /></div>' +
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
        url: "http://localhost:3000/booking/" + id,
        data: JSON.stringify(payload),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        headers: {"Accept": "application/json"}
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
      '</div>'

      $(this).closest(".row").html(newRow);
    });

    $('body').on('click', ".bookingDelete", function(){
      var id = $(this).siblings('input').val();

      $.ajax({
        method: "DELETE",
        url: "http://localhost:3000/booking/" + id
      })
      .done(function( msg ) {
        location.reload();
      });
    });
});
