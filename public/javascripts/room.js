$(document).ready(function(){
  var domain = window.location.host;
  var connection = io.connect("http://" + domain);

  connection.on('room-list', function(rooms){});
});
