//
// Rock Paper Scissor's Gaem Java Script
//  In its present form it works as a 'Single Player' againts the Computer game.
//  In its 'Multiplayer' form,the game will pit player againts player when there
//  there are more than one player present  For the scenario of one player present
//  the computer will jump in aan play againts the one player.
//
//  Other intended future changes:
//      * Utilize Firebase Connection Counting to manage number of playes
//        and which one is still left playing the computer.
//      * Allow mouse clicks to choose Rock/Paper/Scissors.
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
let thisClientNumber = -1; // No choice yet
let firstSelect = 0;       // The 1st player selection

database.ref() .on('value', function(snapshot) {
    if (snapshot.child("gameCounter").exists()  ) 
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
    if (snapshot.child("first_Select").exists())         
        firstSelect = snapshot.val().first_Select;
    console.log('GameCount: ' + gameCount);
    console.log('Player #1 Win Count: ' + winCount[0]);
    console.log('Player #2 Win Count: ' + winCount[1]);
    console.log('Number of Players: ' + numPlayers);
    console.log('Player #1 Choice: ' + playerOneChoice);
    console.log('Player #2 Choice: ' + playerTwoChoice);
    console.log('1St Selection: ' + firstSelect);
    $('who-won').text('Result: ');
    $("#games-played").text('Games Played: ' + gameCount);
    $("#player-one-wins").text('White Spy Win Count: ' + winCount[0]);
    $("#player-two-wins").text('Black Spy Win Count: ' + winCount[1]);
    $("#player-count").text('Number of Players: ' + numPlayers);
    $('#player-one-choice').text('White Spy Choice: ' + rpsTextArray[playerOneChoice]);
    $('#player-two-choice').text('Black Spy Choice: ' + rpsTextArray[playerTwoChoice]);  
  })
  
$('#player-one-choice').on('click', function() {
    if (( thisClientNumber != 1 ) && (first_Select != 1))
    {
        playerOneName = "White Spy";
        thisClientNumber = 1;
        firstSelect = 1;
        numPlayers += 1;
        if (numPlayers > 2) { numPlayers = 2; }
        $("#player-info").text("Playing as White Spy");
    }
});

$('#player-two-choice').on('click', function() {
    if (( thisClientNumber != 2) && (first_Select != 2))
    {
        playerTwoName = "Black Spy";
        thisClientNumber = 2;
        firstSelect = 2;
        numPlayers += 1;
        if (numPlayers > 2) { numPlayers = 2; }
        $("#player-info").text("Playing as Black Spy");
    }
});

$("#clear-game").on("click", function() {
    numPlayers = 0;
    thisClientNumber = -1;
    firstSelect = 0;
    gameCount = 0;
    playerChoice = playerOneChoice = playerTwoChoice = 0;
    playerKeypress = "";
    playerText = "";
    winCount[ 0 ] = 0;
    winCount[ 1 ] = 0;
    database.ref().update({
        playerCount: numPlayers,
        gameCounter: gameCount,
        playerOne_WinLoss: winCount[0],
        playerTwo_WinLoss: winCount[1],
        playerOne_Choice: playerOneChoice,
        playerTwo_Choice: playerTwoChoice,
        first_Select: firstSelect
    });
    $("#player-info").text("Choose White Spy or Black Spy to Start");    
});

 document.onkeyup = function(event)
 {
     playerKeypress = event.key;
     if ((playerKeypress == "R") || (playerKeypress == "r")) 
        { playerChoice = 0; playerKeypress = "r" }
     else if ((playerKeypress == "P") || (playerKeypress == "p"))
        { playerChoice = 1; playerKeypress = "p" }
     else if ((playerKeypress == "S") || (playerKeypress == "s"))
        { playerChoice = 2; playerKeypress = "s" }
     else if (((playerKeypress = 'W') || (playerKeypress == "w")) && thisClientNumber == -1)
        {
            if (( thisClientNumber != 1 ) && ( firstSelect != 1 ))
            {
                playerOneName = "White Spy";
                thisClientNumber = 1;
                firstSelect = 1;
                numPlayers += 1;
                if (numPlayers > 2) { numPlayers = 2; }
                $("#player-info").text("Playing as White Spy");
                return;
            }
        }
    else if (((playerKeypress == 'B' || playerKeypress == "b")) && thisClientNumber == -1)
        {
            if (( thisClientNumber != 2 ) && ( firstSelect != 2 ))
            {
                playerOneName = "Blck Spy";
                thisClientNumber = 2;
                firstSelect = 2;
                numPlayers += 1;
                if (numPlayers > 2) { numPlayers = 2; }
                $("#player-info").text("Playing as Black Spy");
                return;
            }
        }

     else playerChoice = -1; // no valid choice
     // Let computer choose and display results
    if (playerChoice != -1) // If valid user choice then let computer go
    { 
        playerText.textContent = "You Picked: " + rpsTextArray[playerChoice];
        console.log("player picked " + playerKeypress );
        if ( thisClientNumber == 1 )
        {
            playerOneKeypress = playerKeypress;
            playerOneChoice = playerChoice;
        }
        else if ( thisClientNumber == 2 )
        {
            playerTwoKeypress = playerKeypress;
            playerTwoChoice = playerChoice;
        }
        else
        {
            return; // Exit without doing anything if player has not choosen a side
        }

        if (numPlayers == 1)
        {
            computerChoice = Math.random() * 3.0;
            if ( computerChoice < 1.0 )
                { computerKeypress = "r"; computerChoice = 0; }
            else if ((computerChoice >= 1.0) && (computerChoice < 2.0))
                { computerKeypress = "p"; computerChoice = 1; }
            else if ( computerChoice > 2.0 )
                { computerKeypress = "s"; computerChoice = 2; }
            else computerKeypress = "u"; // Unknown
            playerTwoText.textContent = "Computer Picked: " + rpsTextArray[computerChoice];
            console.log("computer picked " + computerKeypress);
            playerTwoKeypress = computerKeypress;
            playerTwoChoice = computerChoice;
        }
        else
        {
            playerTwoText.textContent = "Player Two Picked: " + playerTwoKeypress;
  //          computerKeypress = playerKeypress;
        }
    }
    console.log( thisClientNumber );
    console.log( firstSelect);
    console.log( playerKeypress );
    console.log( playerChoice );

    // See who won
    let playerOneWon = false;
    let playerTwoWon = false;
    // Check for a draw
    if (playerOneKeypress === playerTwoKeypress)
        playerOneWon = PlayerTwoWon = true; // Draw
    else if (( playerOneKeypress === "r" ) && ( playerTwoKeypress === "p" ))
        playerOneWon = true; // Player One Wins
    else if (( playerOneKeypress === "r" ) && ( playerTwoKeypress === "s" ))
        playerTwoWon = true; // Player Two Wins
    else if (( playerOneKeypress === "p" ) && ( playerTwoKeypress === "r" ))
        playerOneWon = true;
    else if (( playerOneKeypress === "p" ) && ( playerTwoKeypress === "s" ))
        playerTwoWon = true;
    else if (( playerOneKeypress === "s" ) && ( playerTwoKeypress === "p" ))
        playerOneWon = true;
    else if (( playerOneKeypress === "s" ) && ( playerTwoKeypress === "r" ))
        playerTwoWon = true;    
    else
        playerOneWon = playerTwoWon = false; // Result unkown

    // Setup the output text based on the results
    if( playerOneWon && !playerTwoWon )
    {
        console.log("White Spy Wins")
        resultText.textContent = "White Spy Wins";
        gameCount += 1;
        winCount[0] += 1;
        playerOneWon = playerTwoWon = false;
    }
    else if( !playerOneWon && playerTwoWon )
    {
        console.log("Blck Spy Wins");
        resultText.textContent = "Black Spy Wins";
        gameCount += 1;
        winCount[1] += 1;
        playerOneWon = playerTwoWon = false;
    }
    else if (playerOneWon && playerTwoWon)
    {
        console.log("Draw");
        resultText.textContent = "Draw";
        gameCount +=1;
        playerOneWon = playerTwoWon = false;
    }
    else
    {
        console.log("Unkown");
        resultText.textContent = "Result Unknown";
        gameCount += 1; 
        playerOneWon = playerTwoWon = false;
    }
    console.log(resultText.textContent );
    $('who-won').text('Result: ' + resultText.textContent);
    $("#games-played").text('Games Played: ' + gameCount);
    $("#player-one-wins").text('Player #1 Win Count: ' + winCount[0]);
    $("#player-two-wins").text('Player #2 Win Count: ' + winCount[1]);
    $("#player-count").text('Number of Players: ' + numPlayers);
    $('#player-one-choice').text('Player #1 Choose: ' + rpsTextArray[playerOneChoice]);
    $('#player-two-choice').text('Player #2 Choose: ' + rpsTextArray[playerTwoChoice]);  
    console.log('GameCount: ' + gameCount);
    console.log('Player #1 Win Count: ' + winCount[0]);
    console.log('Player #2 Win Count: ' + winCount[1]);
    console.log('Number of Players: ' + numPlayers);
    console.log('Player #1 Choice: ' + playerOneChoice);
    console.log('Player #2 Choice: ' + playerTwoChoice);
    console.log('Player Keypress: ' + playerKeypress);
    console.log('Player Choice: ' + playerChoice);
  
    database.ref().update({
        playerCount: numPlayers,
        gameCounter: gameCount,
        playerOne_WinLoss: winCount[0],
        playerTwo_WinLoss: winCount[1],
        playerOne_Choice: playerOneChoice,
        playerTwo_Choice: playerTwoChoice,
        first_Select: firstSelect
    });
 };




