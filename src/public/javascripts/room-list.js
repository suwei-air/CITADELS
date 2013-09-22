
$(document).ready(function(){
	$("input#username").blur(function(){
		//$(this).val("testuser");
	});
	$("#username-form").submit(function(){
		alert("your name is '" + $("input#username").val() + "'.");
		return false;
	});
	$("#room-table tr").click(function(){
		//$(this).children().css("background-color","red");
		alert("click");
		$("#room-table tr").css("background-color","");
		$(this).css("background-color","rgb(50,50,50)");
	});


	// just for testing, to generate room list from json data(which will come from db through websocket)
	var room_info = {"rooms": [
		{"name": "first room", "timeout": 30, "players": 5, "seats": 8},
		{"name": "second room", "timeout": 15, "players": 3, "seats": 8}
	]};

	var room_id = 0;
	for (var i in room_info.rooms){
		var room = room_info.rooms[i];
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
