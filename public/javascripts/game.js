$(document).ready(function(){
  var connection = io.connect(window.location.href);

  connection.on('message', function(data){
    console.log(data.sender + ':: ' + data.message);
  });

  connection.on('game-info', function(GameStatus){
    console.log('game-info: ' + GameStatus);
    // TODO: do a lot
  });

  connection.on('take-action', function(data){
    console.log(data);
    if (!data.result) {
      alert(data.message);
    }
    // TODO: hide every dialog
  });
});
