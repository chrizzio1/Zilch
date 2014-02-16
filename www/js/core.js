/*
* Wenn Document geladen
*/
$(document).ready(function() 
{
	$(document).on("click","#roll",function () 
	{
		alert(1 + Math.floor(Math.random() * 6));
	});
});
	
