//
// Rock Paper Scissor's Gaem Java Script
//  In its present form it works as a 'Single Player' againts the Computer game.
//  In its 'Multiplayer' form,the game will pit player againts player when there
//  there are more than one player present  For the scenario of one player present
//  the computer will jump in aan play againts the one player.
//
//  Other intended changes, use firebase to kee track of layes and scores
//  improve the look and feel with some CSS beyond the basic defaults.
//  Allow mosue clicks to choose Rock/Paper/Scissors.
//
// RPS Array
var rpsTextArray = ["Rock", "Paper", "Scissor"];
var rpsChoiceArray = ["R", "P", "S"];

 // ...
var playerText = document.getElementById("player-choice");
var computerText = document.getElementById("computer-choice");
var resultText = document.getElementById("who-won");
var computerChoice = 0;
var playerChoice = 0;
var playerKeypress = "r";
var computerKeypress = "r";
 
 document.onkeyup = function(event)
 {
     playerKeypress = event.key;
     if ((playerKeypress == "R") || (playerKeypress == "r")) 
        { playerChoice = 0; playerKeypress = "r" }
     else if ((playerKeypress == "P") || (playerKeypress == "p"))
        { playerChoice = 1; playerKeypress = "p" }
     else if ((playerKeypress == "S") || (playerKeypress == "s"))
        { playerChoice = 2; playerKeypress = "s" }
     else playerChoice = -1; // no valid choice
     // Let computer choose and display results
    if (playerChoice != -1) // If valid user choice then let computer go
    { 
        playerText.textContent = "You Picked: " + rpsTextArray[playerChoice];
        console.log("player picked" + playerKeypress );
        computerChoice = Math.random() * 3.0;
        if ( computerChoice < 1.0 )
            { computerKeypress = "r"; computerChoice = 0; }
        else if ((computerChoice >= 1.0) && (computerChoice < 2.0))
            { computerKeypress = "r"; computerChoice = 1; }
        else if ( computerChoice > 2.0 )
            { computerKeypress = "r"; computerChoice = 2; }
        else computerKeypress = "u"; // Unknown
        computerText.textContent = "Computer Picked: " + rpsTextArray[computerChoice];
        console.log("computer picked" + computerKeypress);
    }
    console.log( playerKeypress );
    console.log( playerChoice );
    console.log( computerKeypress );
    console.log( computerChoice );

    // See who won
    // Check for a draw
    if (playerKeypress === computerKeypress)
        resultText.textContent = "Draw";
    else if (( playerKeypress === "r" ) && ( computerKeypress === "p" ))
        resultText.textContent = "Player Wins";
    else if (( playerKeypress === "r" ) && ( computerKeypress === "s" ))
        resultText.textContent = "Computer Wins"
    else if (( playerKeypress === "p" ) && ( computerKeypress === "r" ))
        resultText.textContent = "Player Wins";
    else if (( playerKeypress === "p" ) && ( computerKeypress === "s" ))
        resultText.textContent = "Computer Wins";
    else if (( playerKeypress === "s" ) && ( computerKeypress === "p" ))
        resultText.textContent = "Player Wins";
    else if (( playerKeypress === "s" ) && ( computerKeypress === "r" ))
        resultText.textContent = "Computer Wins"    
    else
        resultText.textContent = "Result Unknown";
    console.log(resultText.textContent );
 };

