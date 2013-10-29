$(document).ready(function(){
  var domain = window.location.host;
  var connection = io.connect("http://" + domain);

  $("input#username").blur(function(){
    //$(this).val("testuser");
  });

  $("#username-form").submit(function(){
    connection.emit('commit-username', $("input#username").val());
    //alert("your name is '" + $("input#username").val() + "'.");
    return false;
  });

  $("#create-room").click(function(){
    $(".dialog-wrap").css("visibility", "visible");
  });
  $("#opt-cancel").click(function(){
    $(".dialog-wrap").css("visibility", "hidden");
  });
  $("#create-opt").submit(function(){
    var newroom = new Object();
    newroom.name = $("input#opt-room-name").val();
    newroom.timeout = $("select#opt-timeout").val();
    newroom.maxbuilding = $("select#opt-maxbuilding").val();
    newroom.players = 1;
    newroom.seats = 8;
    connection.emit('commit-newroom',newroom);
    return false;
  });

  connection.on('commit-newroom', function(data){
    console.log(data);
    if (data.result === true){
      window.location.href = 'http://' + domain + '/room?id=' + data.roomid;
    }
    else{
      alert(data.message);
      $(".dialog-wrap").css("visibility", "hidden");
    }
  });

  connection.on('commit-username', function(data){
    console.log(data);
    if (data.result === true) {
      $("#username-form input[type='submit']").css("visibility", "hidden");
      $("input#username").attr("readonly", "readonly")
        .attr("disabled", "disabled")
        .removeClass("input-invalid");
    }
    else {
      alert(data.message);
      $("input#username").addClass("input-invalid").focus().select();
    }
  });

  connection.on('room-list', function(rooms){
    $("#room-table tbody tr").unbind("click"); // Clear click event of each room
    var room_id = 0;
    for (var i = 0; i<rooms.length; ++i){
      var room = rooms[i];
      console.log(room.name);
      var element = $("#room" + room_id);
      $(element).attr('data-roomid', room.id);
      $(element).children(".td-room-name").html(room.name);
      $(element).children(".td-timeout").html(room.timeout + " s");
      $(element).children(".td-maxbuilding").html(room.maxbuilding);
      $(element).children(".td-players").html(room.players + "/" + room.seats);
      // add click event for room which has content
      $(element).click(function(){
        $("#room-table tr").css("background-color","");
        $(this).css("background-color","rgb(50,50,50)");
      })
      .dblclick(function(){
        window.location.href = 'http://' + domain + '/room?id=' + $(this).attr('data-roomid');
      });
      ++room_id;
      if (room_id > 4){
        break;
      }
    }
    for (room_id; room_id<5; ++room_id){
      $("#room" + room_id).children().html("");
    }
  });
});
