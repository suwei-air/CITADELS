$(document).ready(function(){
	var connection = io.connect("http://localhost");

	function shown(e){
		var isIe=(document.all)?true:false;
		var objId=document.getElementById(e);
		var bobjId=document.getElementById("wrap");
		var bWidth=parseInt(bobjId.scrollWidth);
	   	var bHeight=parseInt(bobjId.scrollHeight);
	   	var sWidth=parseInt((bWidth - objId.clientWidth) / 2);
	   	var sHeight=(bobjId.clientHeight-objId.clientHeight)/2+bobjId.scrollTop;

		var back=document.createElement("div");
		back.id="back";
		var styleStr="top:0px;left:0px;position:absolute;z-index:1;background:#666;width:"+bWidth+"px;height:"+bHeight+"px;";
		styleStr+=(isIe)?"filter:alpha(opacity=70);":"opacity:0.7;";
		back.style.cssText=styleStr;
		document.bobjId.appendChild(back);
    	objId.style.left=sWidth+"px";
		objId.style.top=sHeight+"px";
		objId.style.visibility="visible";
	}

	function shut(e){
		var num=e;
		var bobjId=document.getElementById("wrap")
		document.getElementById(num).style.visibility="hidden";
		var back=document.getElementById("back");
		document.bobjId.removeChild(back);
	}

	$("input#username").blur(function(){
		//$(this).val("testuser");
	});

	$("#username-form").submit(function(){
		connection.emit('commit-username', $("input#username").val());
		//alert("your name is '" + $("input#username").val() + "'.");
		return false;
	});

	$("#room-table tr").click(function(){
		$("#room-table tr").css("background-color","");
		$(this).css("background-color","rgb(50,50,50)");
	});

	$("#create-room").click(function(){
		shown("create-opt");
	});

	$("#opt-cancel").click(function(){
		shut("create-opt");
	});

	$("#opt-ok").click(function(){
		//connection.emit('commit-newroom',);
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
