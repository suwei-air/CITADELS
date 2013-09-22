$(document).ready(function(){
	$("input#username").blur(function(){
		//$(this).val("testuser");
	});
	$("#username-form").submit(function(){
		alert("your name is '" + $("input#username").val() + "'.");
		return false;
	});
	$("#room-table tr").click(function(){
		$("#room-table tr").css("background-color","");
		$(this).css("background-color","rgb(50,50,50)");
	});

	var connection = io.connect("http://localhost");
	connection.on('room-list', function(rooms){
		var room_id = 0;
		for (var i in rooms){
			var room = rooms[i];
			console.log(room.name);
			var element = $("#room" + room_id);
			$(element).children(".td-room-name").html(room.name);
			$(element).children(".td-timeout").html(room.timeout + " s");
			$(element).children(".td-players").html(room.players + "/" + room.seats);
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
