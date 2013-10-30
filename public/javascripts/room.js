$(document).ready(function(){
  var connection = io.connect(window.location.href);

  // add double click event for player seat
  $('#show-players ul li').dblclick(function(){
    if ($(this).children('span.player-name').html() == '&nbsp;'){
      var pos = $(this).attr('id').replace(/player/, '');
      console.log('about to change seat...');
      connection.emit('change-seat', {'pos': pos});
    }
  });

  connection.on('room-info', function(roomInfo){
    document.title = roomInfo.name + ' - 富饶之城';
    for (var i = 0; i<roomInfo.players.length; ++i){
      console.log(roomInfo.players[i]);
      var element = $("#player" + i);
      if (roomInfo.players[i]){
        $(element).children('span').html(roomInfo.players[i]);
      }
      else{
        $(element).children('span').html('&nbsp;');
      }
    }
  });
});
