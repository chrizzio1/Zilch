var $points = new Array(0, 0, 0, 0, 0, 0);
var round = 0;

/*
* Wenn Document geladen
*/
$(document).ready(function() 
{
	
	// tap on roll 
	$(document).on("click","#roll",function () 
	{			
		
		blockSelectedDices();
		newRoll();

		//#####Test######
		// run:
		/* $points = new Array(1,2,3,4,5,6); */
		// no scoring:
		/* $points = new Array(2,2,3,4,4,6); */
		
		round++;
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
			subtractTake($(this).attr('points'));
		}else{
			$(this).addClass("btn-info");			
			selectDicesFromPossibility(number, die);	
			addTake($(this).attr('points'));						
		}
		
	});
	
	$(document).on("click","#take",function () 
	{
		// TODO Punkte in Bank speichern
	});
	
});

// Addiert die gewählten Punkte zur möglichen Bank
function addTake($takepoints){
	$("#take").text(parseInt($("#take").text())+parseInt($takepoints));
}

// Subtrahiert die gewählten Punkte zur möglichen Bank
function subtractTake($takepoints){
	$("#take").text(parseInt($("#take").text())-parseInt($takepoints));
}

function nextRound(){
	unlockAllDices();
}


function unlockAllDices(){
		$.each( $points, function( key, value ) {
			$(".dice-"+(key+1)).removeClass("btn-info");			
		});	
		newRoll();

}

// roll all unselected dices
function rollDices() { 
	
	$.each( $points, function( key, value ) {
		if(value == 0){
			$points[key] = roll();				
		}
		
	});	
	
}

function newRoll(){
		rollDices($points);	
		
		// update view of the dices
		$.each( $points, function( key, value ) {
			$(".dice-"+(key+1)).html(value);
		});
		
		// Show Opporturnities
		showPossibilities();			

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
		}else{
			$(".dice-"+(key+1)).attr("blocked","1");
			$(".dice-"+(key+1)).attr( "disabled", true );
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
		var $takepoints = 0;
		$(".possibilities").html("");
		
		// STANDARD RULES
		for(var i=0;i<=6;i++){
			var $numberOf = numberOf(i);
			var possibilityDescription = 0;
			
			// Ones
			if(i == 1){
				// Drei oder mehr * 1
				if($numberOf >= 3){
					$takepoints = 1000*($numberOf-2);
					possibilityDescription = $numberOf + " " + "ones:" + " " + $takepoints + " points";	
				}
				
				// X * 1
				if($numberOf > 0 && $numberOf < 3){
					$takepoints = 100*$numberOf;
					possibilityDescription = $numberOf + " " + (($numberOf > 1) ? "ones:" : "one:") + " " + $takepoints + " points";	
				}				
			} 
			// Other Number than Ones
			else{			
				
				// Mindestens 3 x (zwei, drei, vier, fünf oder sechs) (3 x zwei = 200; 4 x zwei = 400)
				if($numberOf >= 3){
					$takepoints = 100*i*($numberOf-2);
					possibilityDescription = $numberOf + " times the " + i + ": " + $takepoints + " points";	
				} 
				// Die Fünf (1x Fünf = 50 Pkt.)
				else if(i == 5 && $numberOf > 0 && $numberOf < 3){
					$takepoints = 50*$numberOf;
					possibilityDescription = $numberOf + " " + (($numberOf > 1) ? "fives:" : "five:") + " " + $takepoints + " points";
				}
			}	
			if(possibilityDescription!=0){
				addPossibility($numberOf,i,possibilityDescription,$takepoints);				
				
			}
		}
		
		// SPECIAL RULES
		
		// Straße (Alle Zahlen von 1 - 6) : 1500 Pkt.
		var singleDices = 0;
		for(var i=0;i<=6;i++){
			// Kommt jede Zahl nur 1x vor?
			if(numberOf(i)==1){
				singleDices++;
				// Kommen alle Zahlen nur 1x vor?
				if(singleDices==6){
					$(".possibilities").html("");
					addPossibility($numberOf,"all","Run (1 to 6) : 1500 Points.",1500);	
				}
			}
		}
		
		// @TODO Sonderregeln hinzufügen
		
		// Keine Punkte im 1. Wurf
		if(round == 0 && $(".possibilities").html()==""){
			addPossibility($numberOf,"all","No scoring dice: 500",500);	
		}
		
		// ZILCH
		if(round >= 1 && $(".possibilities").html()==""){
			addPossibility($numberOf,"zilch","ZILCH!",-500);	
		}
	
}

// Prüfung, ob Würfel schon aktiviert wurde
function isDiceSelected($key) { 
	if($(".dice-"+($key)).hasClass("btn-info")){
		return true;
	} else{
		return false;
	}	
}

function addPossibility(numberOf, die, text, $takepoints) { 
	$(".possibilities").html($(".possibilities").html() + "<br />" + "<button points='"+$takepoints+"' number='"+numberOf+"' die='"+die+"' class='btn btn-default possibility'>" + text + '</button>');

 }
 
// Bei Auswahl eines Vorschlages werden entsprechende Würfel gewählt
function selectDicesFromPossibility(number, die) { 
		
	if(die=="zilch"){
		nextRound();
	}
	
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

// Bei Abwahl eines Vorschlages werden entsprechende Würfel deaktiviert
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