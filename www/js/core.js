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
		
		// Show Opporturnities
		showOpporturnities();
		
		
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
		if(!isDiceSelected(key+1)){
			$points[key] = 0;
		}
	});
}

// Ermittelt die Anzahl, wie oft eine bestimmte Zahl gewürfelt wurde
function numberOf( $number ){
	var $count = 0;
	$.each( $points, function( key, value ) {
		if(value == $number && !isDiceSelected(key+1)){
			$count++;
		}
	});
	return $count;
}

// show the possible Dice Combinations
function showOpporturnities() { 		
		
		var numberOfOnes = numberOf(1);
		var numberOfTwos = numberOf(2);
		var numberOfThrees = numberOf(3);
		var numberOfFours = numberOf(4);
		var numberOfFives = numberOf(5);
		var numberOfSixes = numberOf(6); 		

		var $possibilites = new Array();
		
		for(var i=0;i<6;i++){
			var $numberOf = numberOf(i);
			
			// Ones
			if(i == 1){
				// Drei oder mehr * 1
				if($numberOf >= 3){
					$possibilites.push($numberOf + " " + "Einsen:" + " " + 1000*($numberOf-2) + " Punkte");	
				}
				
				// X * 1
				if($numberOf > 0 && $numberOf < 3){
					$possibilites.push($numberOf + " " + (($numberOf > 1) ? "Einsen:" : "Eins:") + " " + 100*$numberOf + " Punkte");	
				}
			} else{			

				if($numberOf >= 3){
					$possibilites.push($numberOf + " " + "Einsen:" + " " + 1000*($numberOf-2) + " Punkte");	
				}
				

				if($numberOf > 0 && $numberOf < 3){
					$possibilites.push($numberOf + " " + (($numberOf > 1) ? "Einsen:" : "Eins:") + " " + 100*$numberOf + " Punkte");	
				}
			}
			

		}
				
		/* Show Possibilities */
		$(".possibility").html("");
		$.each( $possibilites, function( key, value ) {			
			$(".possibility").html($(".possibility").html() + "<br />" + "<div class='btn btn-default possibility'>" + value + '</div>');
	});
	
	
}



function isDiceSelected($key) { 
	if($(".dice-"+($key)).hasClass("btn-info")){
		return true;
	} else{
		return false;
	}	
}