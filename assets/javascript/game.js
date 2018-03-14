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
var playerOneText = document.getElementById("player-one-choice");
var playerTwoText = document.getElementById("player-two-choice");
var playerText = "";
var resultText = document.getElementById("who-won");
var playerChoice = 0;
var playerKeypress = "r";
var playerOneChoice = 0;
var playerTwoChoice = 0;
var playerOneKeypress = "r";
var playerTwoKeypress = "r";
var playerOneName = "Mike";
var playerTwoName = "HAL";

// Initialize Firebase (YOUR OWN APP)
// Make sure that your configuration matches your firebase script version
// (Ex. 3.0 != 3.7.1)
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDqQmnoN1CmZYNpWozEzBotXLuDZTRMKiM",
    authDomain: "rockpaperscissors-7f2e8.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-7f2e8.firebaseio.com",
    projectId: "rockpaperscissors-7f2e8",
    storageBucket: "",
    messagingSenderId: "789774774986"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
// var database = ...
var database = firebase.database();

var gameCount = 0;
var winCount = [ 0, 0 ];
var numPlayers = 0;

database.ref() .on('value', function(snapshot) {
    if (snapshot.child("gameCounter").exists()) 
        gameCount = parseInt(snapshot.val().gameCounter);
    if (snapshot.child("playerOne_WinLoss").exists()) 
        winCount[0] = parseInt(snapshot.val().playerOne_WinLoss);
    if (snapshot.child("playerTwo_WinLoss").exists()) 
        winCount[1] = parseInt(snapshot.val().playerTwo_WinLoss);
    if (snapshot.child("playerCount").exists()) 
        numPlayers =  parseInt(snapshot.val().playerCount);
    if (snapshot.child("playerOne_Choice").exists()) 
        playerOneChoice = snapshot.val().playerOne_Choice;
    if (snapshot.child("playerTwo_Choice").exists())         
        playerTwoChoice = snapshot.val().playerTwo_Choice;
    if (snapshot.child("playerOne_Name").exists()) 
        playerOneName = snapshot.val().playerOne_Name;
    if (snapshot.child("playerTwo_Name").exists())         
        playerTwoName = snapshot.val().playerTwo_Name;
    console.log('GameCount: ' + gameCount);
    console.log('Player #1 Name: ' + playerOneName);   
    console.log('Player #1 Win Count: ' + winCount[0]);
    console.log('Player #1 Choice: ' + playerOneChoice);
    console.log('Player #2 Name: ' + playerTwoName);   
    console.log('Player #2 Win Count: ' + winCount[1]);
    console.log('Player #2 Choice: ' + playerTwoChoice);
    console.log('Number of Players: ' + numPlayers);
    $('who-won').text('Result: ');
    $("#games-played").text('Games Played: ' + gameCount);
    $("#player-one-wins").text(playerOneName + ' Win Count: ' + winCount[0]);
    $("#player-two-wins").text(playerTwoName + ' Win Count: ' + winCount[1]);
    $("#player-count").text('Number of Players: ' + numPlayers);
    if( playerOneChoice != -1)
        $('#player-one-choice').text(playerOneName + ' Choice: ' + rpsTextArray[playerOneChoice]);
    else
        $('#player-one-choice').text(playerOneName + ' Choice: Unknown');
    if( playerTwoChoice != -1)
        $('#player-two-choice').text(playerTwoName + ' Choice: ' + rpsTextArray[playerTwoChoice]);  
    else
        $('#player-one-choice').text(playerTwoName + ' Choice: Unknown');
  })
  
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

    // Assigne the choice to player one
    playerOneKeypress = playerKeypress;
    playerOneChoice = playerChoice;

     // Let computer choose and display results
    if (playerChoice != -1) // If valid user choice then let computer go
    { 
        playerText.textContent = "You Picked: " + rpsTextArray[playerChoice];
        console.log("player picked " + playerKeypress );

        if (numPlayers == 1) // One player plays againts computer
        {   
            computerChoice = Math.random() * 3.0;
            if ( computerChoice < 1.0 )
                { computerKeypress = "r"; computerChoice = 0; }
            else if ((computerChoice >= 1.0) && (computerChoice < 2.0))
                { computerKeypress = "r"; computerChoice = 1; }
            else if ( computerChoice > 2.0 )
                { computerKeypress = "r"; computerChoice = 2; }
            else computerKeypress = "u"; // Unknown
            playerTwoText.textContent = "Computer Picked: " + rpsTextArray[computerChoice];
            console.log("computer picked " + computerKeypress);
            playerTwoKeypress = computerKeypress;
            playerTwoChoice = computerChoice;
        }
        else if(numPlayers == 2) // Another player is playing
        {
            playerTwoText.textContent = "Player Two Picked: " + playerKeypress;
            computerKeypress = playerKeypress;
            playerTwoKeypress = playerKeypress;
            playerTwoChoice = playerChoice;
        }
        else // Zero or otherwise out of bounds
        { // Set values to display/store something for this corner case
            playerOneText.textContent = "Player One Picked: Nothing";
            playerKeypress = '';
            playerOneKeypress = '';
            playerTwoChoice = -1;
            playerTwoText.textContent = "Player Two Picked: Nothing";
            computerKeypress = '';
            playerTwoKeypress = '';
            playerTwoChoice = -1;
        }
    }
    console.log( playerKeypress );
    console.log( playerChoice );

    // See who won
    let playerWon = false;
    let computerWon = false;
    // Check for a draw
    if (playerKeypress === computerKeypress)
        playerWon = computerWon = true; // Draw
    else if (( playerKeypress === "r" ) && ( computerKeypress === "p" ))
        playerWon = true; // Player Wins
    else if (( playerKeypress === "r" ) && ( computerKeypress === "s" ))
        computerWon = true; // Computer Wins
    else if (( playerKeypress === "p" ) && ( computerKeypress === "r" ))
        playerWon = true;
    else if (( playerKeypress === "p" ) && ( computerKeypress === "s" ))
        computerWon = true;
    else if (( playerKeypress === "s" ) && ( computerKeypress === "p" ))
        playerWon = true;
    else if (( playerKeypress === "s" ) && ( computerKeypress === "r" ))
        computerWon = true;    
    else
        playerWon = computerWon = false; // Result unkown

    // Setup the output text based on the results
    if( playerWon && !computerWon )
    {
        console.log("Player Wins")
        resultText.textContent = "Player Wins";
        gameCount += 1;
        winCount[0] += 1;
        playerWon = computerWon = false;
    }
    else if( !playerWon && computerWon )
    {
        console.log("Computer Wins");
        resultText.textContent = "Computer Wins";
        gameCount += 1;
        winCount[1] += 1;
        playerWon = computerWon = false;
    }
    else if (playerWon && computerWon)
    {
        console.log("Draw");
        resultText.textContent = "Draw";
        gameCount +=1;
        playerWon = computerWon = false;
    }
    else
    {
        console.log("Unkown");
        resultText.textContent = "Result Unknown";
        playerWon = computerWon = false;
    }
    console.log(resultText.textContent );
    $('who-won').text('Result: ' + resultText.textContent);
    $("#games-played").text('Games Played: ' + gameCount);
    $("#player-one-wins").text(playerOneName + ' Win Count: ' + winCount[0]);
    $("#player-two-wins").text(playerTwoName + ' Win Count: ' + winCount[1]);
    $("#player-count").text('Number of Players: ' + numPlayers);
    if( playerOneChoice != -1)
        $('#player-one-choice').text(playerOneName + ' Choice: ' + rpsTextArray[playerOneChoice]);
    else
        $('#player-one-choice').text(playerOneName + ' Choice: Unknown');
    if( playerTwoChoice != -1)
        $('#player-two-choice').text(playerTwoName + ' Choice: ' + rpsTextArray[playerTwoChoice]);  
    else
        $('#player-one-choice').text(playerTwoName + ' Choice: Unknown');
    console.log('GameCount: ' + gameCount);
    console.log('Player #1 Name: ' + playerOneName);
    console.log('Player #1 Win Count: ' + winCount[0]);
    console.log('Player #1 Choice: ' + playerOneChoice);
    console.log('Player #2 Name: ' + playerTwoName);
    console.log('Player #2 Win Count: ' + winCount[1]);
    console.log('Player #2 Choice: ' + playerTwoChoice);
    console.log('Number of Players: ' + numPlayers);
    console.log('Player Keypress: ' + playerKeypress);
    console.log('Player Choice: ' + playerChoice);
  
    database.ref().update({
        playerCount: numPlayers,
        gameCounter: gameCount,
        playerOne_Name: playerOneName,
        playerTwo_Name: playerTwoName,
        playerOne_WinLoss: winCount[0],
        playerTwo_WinLoss: winCount[1],
        playerOne_Choice: playerOneChoice,
        playerTwo_Choice: playerTwoChoice
    });
 };




