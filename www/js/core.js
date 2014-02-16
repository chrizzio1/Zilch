var $points = new Array(0, 0, 0, 0, 0, 0);

/*
* Wenn Document geladen
*/
$(document).ready(function() 
{
	
	// tap on roll 
	$(document).on("click","#roll",function () 
	{			
		
		blockSelectedDices();
		rollDices($points);
				
		// update view of the dices
		$.each( $points, function( key, value ) {
			$(".dice-"+(key+1)).html(value);
		});
		
		// show the opportunities
		
		var numberOfOnes = numberOf(1);
		var numberOfTwos = numberOf(2);
		var numberOfThrees = numberOf(3);
		var numberOfFours = numberOf(4);
		var numberOfFives = numberOf(5);
		var numberOfSixes = numberOf(6); 		

		var $possibilites = new Array();
		
		if(numberOfOnes == 3){
			$possibilites.push("Drei einsen: " + "1000");	
		}
		if(numberOfOnes > 0 && numberOfOnes < 3){
			$possibilites.push(numberOfOnes + " " + ((numberOfOnes > 1) ? "Einsen:" : "Eins:") + " " + 100*numberOfOnes + " Punkte");	
		}
		
		
	$.each( $possibilites, function( key, value ) {
		$(".possibility").html("");
		$(".possibility").html($(".possibility").html() + "<br />" + "<div class='btn btn-default possibility'>" + value + '</div>');
	});
		
		
/* 		checkRules();  */
		

	});

	// select / deselect a dice
	$(document).on("click",".dice",function () 
	{			
		if($(this).hasClass("btn-info")){
			$(this).removeClass("btn-info");
		}else{
			$(this).addClass("btn-info");
		}

	});
	
});

// roll all unselected dices
function rollDices() { 
	
	$.each( $points, function( key, value ) {
		if(value == 0){
			$points[key] = roll();				
		}
		
	});	
	
}

// random number from 1 - 6 
function roll() { 
		
	return 1 + Math.floor(Math.random() * 6);
}
	
// Prevent selected dices from beeing rolled
function blockSelectedDices(){
	$.each( $points, function( key, value ) {
		if(!$(".dice-"+(key+1)).hasClass("btn-info")){
			$points[key] = 0;
		}
	});
}

function numberOf( $number ){
	var $count = 0;
	$.each( $points, function( key, value ) {
		if(value == $number){
			$count++;
		}
	});
	return $count;
}