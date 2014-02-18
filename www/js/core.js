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

		//Test
		//alle
		/* $points = new Array(1,2,3,4,5,6); */
		
		// update view of the dices
		$.each( $points, function( key, value ) {
			$(".dice-"+(key+1)).html(value);
		});
		
		// Show Opporturnities
		showPossibilities();
		
		
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
	
	// select / deselect a possibility
	$(document).on("click",".possibility",function () 
	{			
		var number = $(this).attr("number");
		var die = $(this).attr("die");
	
		if($(this).hasClass("btn-info")){
			$(this).removeClass("btn-info");
			deselectDicesFromPossibility(number, die);
		}else{
			$(this).addClass("btn-info");			
			selectDicesFromPossibility(number, die);
					
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
function showPossibilities() { 		
		
		var $possibilites = new Array();
		var possibilityDescription = "";
		
		$(".possibilities").html("");
		
		// STANDARD RULES
		for(var i=0;i<=6;i++){
			var $numberOf = numberOf(i);
			var possibilityDescription = 0;
			
			// Ones
			if(i == 1){
				// Drei oder mehr * 1
				if($numberOf >= 3){
					possibilityDescription = $numberOf + " " + "Einsen:" + " " + 1000*($numberOf-2) + " Punkte";	
				}
				
				// X * 1
				if($numberOf > 0 && $numberOf < 3){
					possibilityDescription = $numberOf + " " + (($numberOf > 1) ? "Einsen:" : "Eins:") + " " + 100*$numberOf + " Punkte";	
				}				
			} 
			// Other Number than Ones
			else{			
				
				// Mindestens 3 x (zwei, drei, vier, fünf oder sechs) (3 x zwei = 200; 4 x zwei = 400)
				if($numberOf >= 3){
					possibilityDescription = $numberOf + " mal die " + i + ": " + 100*i*($numberOf-2) + " Punkte";	
				} 
				// Die Fünf (1x Fünf = 50 Pkt.)
				else if(i == 5 && $numberOf > 0 && $numberOf < 3){
					possibilityDescription = $numberOf + " " + (($numberOf > 1) ? "Fünfen:" : "Fünf:") + " " + 50*$numberOf + " Punkte";
					/* $possibilites.push($numberOf + " " + (($numberOf > 1) ? "Fünfen:" : "Fünf:") + " " + 50*$numberOf + " Punkte");	 */
				}
			}	
			if(possibilityDescription!=0){
				addPossibility($numberOf,i,possibilityDescription);
			}
		}
		
		// SPECIAL RULES
		
		// Alle Zahlen von 1 - 6 
		var singleDices = 0;
		for(var i=0;i<=6;i++){
			// Kommt jede Zahl nur 1x vor?
			if(numberOf(i)==1){
				singleDices++;
				// Kommen alle Zahlen nur 1x vor?
				if(singleDices==6){
					$(".possibilities").html("");
					addPossibility($numberOf,"all","Straße (1 bis 6) : 1500 Punkte.");	
				}
			}
		}
				
	
}



function isDiceSelected($key) { 
	if($(".dice-"+($key)).hasClass("btn-info")){
		return true;
	} else{
		return false;
	}	
}

function addPossibility(numberOf, die, text) { 
	$(".possibilities").html($(".possibilities").html() + "<br />" + "<button number='"+numberOf+"' die='"+die+"' class='btn btn-default possibility'>" + text + '</button>');

 }
 
function selectDicesFromPossibility(number, die) { 
	
	if(die=="all"){
		$.each( $points, function( key, value ) {
				$(".dice-"+(key+1)).addClass("btn-info");			
		});	
	}

	$.each( $points, function( key, value ) {
		if(value == die ){
			$(".dice-"+(key+1)).addClass("btn-info");			
		}
	});	
	
}

function deselectDicesFromPossibility(number, die) { 

	if(die=="all"){
		$.each( $points, function( key, value ) {
			$(".dice-"+(key+1)).removeClass("btn-info");			
		});	
	}

	$.each( $points, function( key, value ) {
		if(value == die ){
			$(".dice-"+(key+1)).removeClass("btn-info");			
		}
	});	
	
}