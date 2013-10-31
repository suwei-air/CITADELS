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

  $('#btn-back').click(function(){
    connection.emit('leave-room', {});
  });
  $('#btn-start').click(function(){
    alert('starting');
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
  connection.on('leave-room', function(data){
    if (true === data.result){
      window.location.href = 'http://' + window.location.host + '/room-list';
    }
  });
});
