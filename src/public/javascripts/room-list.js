$(document).ready(function(){
	var connection = io.connect("http://localhost");

	$("input#username").blur(function(){
		//$(this).val("testuser");
	});

	$("#username-form").submit(function(){
		connection.emit('commit-username', $("input#username").val());
		//alert("your name is '" + $("input#username").val() + "'.");
		return false;
	});

	$("#room-table tbody tr").click(function(){
		$("#room-table tr").css("background-color","");
		$(this).css("background-color","rgb(50,50,50)");
	});

	$("#create-room").click(function(){
		//shown("create-opt");
		$(".dialog-wrap").css("visibility", "visible");
	});
	$("#opt-cancel").click(function(){
		//shut("create-opt");
		$(".dialog-wrap").css("visibility", "hidden");
	});
	$("#create-opt").submit(function(){
		//connection.emit('commit-newroom',);
		return false;
	});

	connection.on('commit-username', function(data){
		console.log("result=" + data.result);
		console.log("message=" + data.message);
		//if (result === true) {}
		//else {}
	});

	connection.on('room-list', function(rooms){
		var room_id = 0;
		for (var i = 0; i<rooms.length; ++i){
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
