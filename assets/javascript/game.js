//
// Rock Paper Scissor's Gaem Java Script
//  In its present form it works as a 'Single Player' againts the Computer game.
//  In its 'Multiplayer' form,the game will pit player againts player when there
//  there are more than one player present  For the scenario of one player present
//  the computer will jump in aan play againts the one player.
//
//  Other intended future changes:
//      * Allow mouse clicks to choose Rock/Paper/Scissors.
//      * Correct logic so that Spys do not act like double agents (black is whte etc)
//      * Have White/Black show as grey until player selects side, then turn choicue to White/Black
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
var numPlayers = 0;
var numConnections = 0;

//var playerNum = false;
var playerOneExists = false;
var playerTwoExists = false;
var playerOneData = null;
var playerTwoData = null;

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
var playersRef = database.ref("players");

//////////////////////
// Connection Logic //
//////////////////////
// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/playerConnections");
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the player count.
  // The number of online users is the number of children in the connections list.
  numConnections = snap.numChildren()-1;
  if (numConnections > 2) /* Range limit it */
      numConnections = 2;
});

// Tracks changes in key which contains player objects
playersRef.on("value", function(snapshot) {

  // length of the 'players' array
  numPlayers = snapshot.numChildren();

  // Check to see if players exist
  playerOneExists = snapshot.child("1").exists();
  playerTwoExists = snapshot.child("2").exists();

  // Player data objects
  playerOneData = snapshot.child("1").val();
  playerTwoData = snapshot.child("2").val();
  if(playerOneExists) {
  playerOneData.wins = snapshot.child("1").wins;
  playerOneData.choice = snapshot.child("1").choice; }
  if (playerTwoExists) {
  playerTwoData.wins = snapshot.child("2").wins;
  playerTwoData.choice = snapshot.child("2").choice; }
  
  // If theres a player 1, fill in name and win loss data
  if (playerOneExists) {
//    $("#player1-name").text(playerOneData.name);
    $("#player-one-wins").text(playerOneData.wins);
//    $("#player1-losses").text("Losses: " + playerOneData.losses);
  }
  else
  {
    // If there is no player 1, clear win/loss data and show waiting
//   $("#player1-name").text("Waiting for Player 1");
    $("#player-one-wins").empty();
//    $("#player1-losses").empty();
  }

  // If theres a player 2, fill in name and win/loss data
  if (playerTwoExists) {
//    $("#player2-name").text(playerTwoData.name);
    $("#player-two-wins").text(playerTwoData.wins);
//    $("#player2-losses").text("Losses: " + playerTwoData.losses);
  }
  else
  {
    // If no player 2, clear win/loss and show waiting
 //   $("#player2-name").text("Waiting for Player 2");
    $("#player-two-wins").empty();
 //   $("#player2-losses").empty();
  }
});

// Function to get in the game
function getInGame() {

    // For adding disconnects to the chat with a unique id (the date/time the user entered the game)
    // Needed because Firebase's '.push()' creates its unique keys client side,
    // so you can't ".push()" in a ".onDisconnect"
 //   var chatDataDisc = database.ref("/chat/" + Date.now());
  
    // Checks for current players, if theres a player one connected, then the user becomes player 2.
    // If there is no player one, then the user becomes player 1
    if (currentPlayers < 2) {
  
      if (playerOneExists) {
        playerNum = 2;
        firstSelect = 2;
        username = playerTwoName;
      }
      else {
        playerNum = 1;
        firstSelect = 1;
        username = playerOneName;
      }
  
      // Creates key based on assigned player number
      playerRef = database.ref("/players/" + playerNum);

      // Creates player object. 'choice' is unnecessary here, but I left it in to be as complete as possible
      playerRef.set({
        name: username,
        wins: 0,
        losses: 0,
        choice: null
      });
  
      // On disconnect remove this user's player object
      playerRef.onDisconnect().remove();

 //   // Remove name input box and show current player number.
 //   $("#swap-zone").html("<h2>Hi " + username + "! You are Player " + playerNum + "</h2>");
      console.log( username + ' is player # ' + playerNum);
  }
  else {

    // If current players is "2", will not allow the player to join
    alert("Sorry, Game Full! Try Again Later!");
  }
}  

////////////////
// Game Logic //
////////////////
var gameCount = 0;
var winCount = [ 0, 0 ];

let thisClientNumber = -1; // No choice yet
let firstSelect = 0;       // The 1st player selection

database.ref() .on('value', function(snapshot) {
    if (snapshot.child("gameCounter").exists()  ) 
        gameCount = parseInt(snapshot.val().gameCounter);
// REview this, do I want to use thes or the other structure for WinLoss
        //    if (snapshot.child("playerOne_WinLoss").exists()) 
//        winCount[0] = parseInt(snapshot.val().playerOne_WinLoss);
//    if (snapshot.child("playerTwo_WinLoss").exists()) 
//        winCount[1] = parseInt(snapshot.val().playerTwo_WinLoss);
//    if (snapshot.child("playerCount").exists()) 
//        numPlayers =  parseInt(snapshot.val().playerCount);
    console.log('playerOneExists' + playerOneExists);
    if(playerOneExists)
        console.log('playerOneData.wins' + playerOneData.wins);
    console.log('playerTwoExists' + playerTwoExists);
    if(playerTwoExists)
        console.log('playerTwoData.wins' + playerTwoData.wins);
    if (playerOneExists)
    { 
        if ( playerOneData.wins != undefined )
            winCount[0] = playerOneData.wins;
 //       else
 //           winCount[0] = 0;
    }
    if (playerTwoExists)
    {
        if ( playerTwoData.wins != undefined )
            winCount[1] = playerTwoData.wins;
//        else
//            winCount[1] = 0;  // can't do this, it julst makes thiks stuc
    }
    //if (snapshot.child("playerCount").exists()) 
    //    numPlayers =  parseInt(snapshot.val().playerCount);
    // relying on the on playerRef to provide the above info
    if (playerOneExists)
    {
        if (playerOneChoice.choice != undefined )
            playerOneChoice = playerOneData.choice;
//        else
//            playerOneChoice = 0;
    }
    if (playerTwoExists)
    {
        if(playerTwoData.choice != undefined )         
            playerTwoChoice = playerTwoData.choice;
//        else
//            playerTwoChoice = 0;
    }
//    if (snapshot.child("first_Select").exists())         
//        firstSelect = snapshot.val().first_Select;
    console.log('GameCount: ' + gameCount);
    console.log('Player #1 Win Count: ' + winCount[0]);
    console.log('Player #2 Win Count: ' + winCount[1]);
    console.log('Number of Players: ' + numPlayers);
    console.log('Player #1 Choice: ' + playerOneChoice);
    console.log('Player #2 Choice: ' + playerTwoChoice);
    console.log('1st Selection: ' + firstSelect);
    $('who-won').text('Result: ');
    $("#games-played").text('Games Played: ' + gameCount);
    $("#player-one-wins").text('White Spy Win Count: ' + winCount[0]);
    $("#player-two-wins").text('Black Spy Win Count: ' + winCount[1]);
    $("#player-count").text('Number of Players: ' + numPlayers);
    $('#player-one-choice').text('White Spy Choice: ' + rpsTextArray[playerOneChoice]);
    $('#player-two-choice').text('Black Spy Choice: ' + rpsTextArray[playerTwoChoice]);  
    if (firstSelect == 1)
        $("#player-info").text("Playing as White Spy");
    else if (firstSelect == 2)
        $("#player-info").text("Playing as Black Spy");
    else
        $("#player-info").text("Choose White Spy or Black Spy to Start");

    // set this user's selection automatically if another person has allready selected a spy
//    if (numConnections == 2)
//    {
//        // Correct number of player count to connection count
//        if (numPlayers == 1)
//        {
//            numPlayers = 2;
//       }
//        // Make the automatic selection to be opposite
//        if (firstSelect == 1)
//            thisClientNumber = 2;
//        else if (firstSelect == 2)
//            thisClientNumber = 1;
//        else
//            thisClientNumber = -1; // no selection
//    }
//    else if (numConnections == 1)
//    {
//        // Correct number of player count to connection count
//        if(numPlayers == 2)
//        {
//            numPlayers == 1;
//        }
//        // Make the selection to be the same
//        if (firstSelect == 1)
//            thisClientNumber = 1;
//        else if (firstSelect == 2)
//            thisClientNumber = 2;
//        else
//            thisClientNumber = -1; // no selection
//    }
//    else
//       thisClientNumber = -1; // no selection

});
  
$('#player-one-choice').on('click', function() {
    if (( thisClientNumber != 1 ) && (firstSelect != 1))
    {
        playerOneName = "White Spy";
        thisClientNumber = 1;
        firstSelect = 1;
        numPlayers += 1;
        if (numPlayers > 2) { numPlayers = 2; }
        $("#player-info").text("Playing as White Spy");
        getInGame();
    }
});

$('#player-two-choice').on('click', function() {
    if (( thisClientNumber != 2) && (firstSelect != 2))
    {
        playerTwoName = "Black Spy";
        thisClientNumber = 2;
        firstSelect = 2;
        numPlayers += 1;
        if (numPlayers > 2) { numPlayers = 2; }
        $("#player-info").text("Playing as Black Spy");
        getInGame();
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
    $("#player-info").css({'color': 'lightgrey' });    
});

 document.onkeyup = function(event)
 {
     playerChoice = -1;  //until determined otherwise, no choice was made.
     playerKeypress = event.key;
     if ((playerKeypress == "R") || (playerKeypress == "r")) 
        { playerChoice = 0; playerKeypress = "r" }
     else if ((playerKeypress == "P") || (playerKeypress == "p"))
        { playerChoice = 1; playerKeypress = "p" }
     else if ((playerKeypress == "S") || (playerKeypress == "s"))
        { playerChoice = 2; playerKeypress = "s" }
     else if (((playerKeypress == 'W') || (playerKeypress == "w")) && thisClientNumber == -1)
        {
            if (( thisClientNumber != 1 ) && ( firstSelect != 1 ))
            {
                playerOneName = "White Spy";
                thisClientNumber = 1;
                firstSelect = 1;
                numPlayers += 1;
                if (numPlayers > 2) { numPlayers = 2; }
                $("#player-info").text("Playing as White Spy");
                $("#player-info").css({'color': 'white' });
                return;
            }
        }
    else if (((playerKeypress == 'B' || playerKeypress == "b")) && thisClientNumber == -1)
        {
            if (( thisClientNumber != 2 ) && ( firstSelect != 2 ))
            {
                playerOneName = "Black Spy";
                thisClientNumber = 2;
                firstSelect = 2;
                numPlayers += 1;
                if (numPlayers > 2) { numPlayers = 2; }
                $("#player-info").text("Playing as Black Spy");
                $("#player-info").css({'color': 'black' });
 
                return;
            }
        }

     else playerChoice = -1; // no valid choice
     // Let computer choose and display results
    if (playerChoice != -1) // If valid user choice then let computer go
    { 
        // Range check this value befoe using it
        if((thisClientNumber < 1) || (thisClientNumber>2))
           return;

        // Creates key based on assigned player number
        playerRef = database.ref("/players/" + thisClientNumber);

        // Grabs text from keypress choice
        // Need to set player ref to the correct entry for the selected user
        console.log(playerRef);

        // Sets the choice in the current player object in firebase
        playerRef.child("choice").set(playerChoice);

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
            // Make sure the computer choice is assigned to the other player
            if (thisClientNumber == 1 )
            {
                playerTwoKeypress = computerKeypress;
                playerTwoChoice = computerChoice;
            } else if (thisClientNumber == 2)
            {
                playerOneKeypress = computerKeypress;
                playerOneChoice = computerChoice;                
            }
            else
            {
                console.log ('This shoudl not happen');
            }
        }
        else
        {
            playerTwoText.textContent = "Black Spy Picked: " + playerTwoKeypress;
            playerOneText.textContent = "White Spy Picked: " + playerOneKeypress;
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
    $("#player-one-wins").text('White Spy Win Count: ' + winCount[0]);
    $("#player-two-wins").text('Black Spy Win Count: ' + winCount[1]);
    $("#player-count").text('Number of Players: ' + numPlayers);
    $('#player-one-choice').text('White Spy Choice: ' + rpsTextArray[playerOneChoice]);
    $('#player-two-choice').text('Black Spy Choice: ' + rpsTextArray[playerTwoChoice]);
    if (firstSelect == 1)
    {
        $("#player-info").text("Playing as White Spy");
        $("#player-info").css({'color': 'white' });
    }
    else if (firstSelect == 2)
    {
        $("#player-info").text("Playing as Black Spy");
        $("#player-info").css({'color': 'black' });
    }
    else
    {
        $("#player-info").text("Choose White Spy or Black Spy to Start");
        $("#player-info").css({'color': 'lightgrey' });
    }

    console.log('GameCount: ' + gameCount);
    console.log('Player #1 Win Count: ' + winCount[0]);
    console.log('Player #2 Win Count: ' + winCount[1]);
    console.log('Number of Players: ' + numPlayers);
    console.log('Player #1 Choice: ' + playerOneChoice);
    console.log('Player #2 Choice: ' + playerTwoChoice);
    console.log('Player Keypress: ' + playerKeypress);
    console.log('Player Choice: ' + playerChoice);
    console.log('1st Selection: ' + firstSelect);
  
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




