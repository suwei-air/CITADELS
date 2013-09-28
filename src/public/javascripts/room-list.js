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
		var newroom = new Object();
		newroom.name = $("input#opt-room-name").val();
		newroom.timeout = $("select#opt-timeout").val();
		newroom.maxbuilding = $("select#opt-maxbuilding").val();
		newroom.players = 1;
		newroom.seats = 8;
		connection.emit('commit-newroom',newroom);
		$(".dialog-wrap").css("visibility", "hidden");
		return false;
	});

	connection.on('commit-username', function(data){
		console.log("result=" + data.result);
		console.log("message=" + data.message);
		//if (result === true) {}
		//else {}
	});

	connection.on('room-list', function(rooms){
		$("#room-display").empty();
		var room_id = 0;
		for (var i = 0; i<rooms.length; ++i){
			var room = rooms[i];
			//console.log(room.name);
			var tr_0 = $("<tr></tr>").attr("id", "room"+room_id);
			var td_1 = '<td class="td-room-name"></td>';
			var td_2 = '<td class="td-timeout"></td>';
			var td_3 = '<td class="td-maxbuilding"></td>';
			var td_4 = '<td class="td-players"></td>';
			$("tbody#room-display").append(tr_0);
			var element = $("#room" + room_id);
			$(element).append(td_1, td_2, td_3, td_4);
			$(element).children(".td-room-name").html(room.name);
			$(element).children(".td-timeout").html(room.timeout + " s");
			$(element).children(".td-maxbuilding").html(room.maxbuilding);
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
