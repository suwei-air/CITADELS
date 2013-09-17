
$(document).ready(function(){
	$("tr").click(function(){
		$(this).children().css("background-color","red");
	});
});

function check(id){
	id.value="testuser";
}
