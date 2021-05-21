// Function to create sound object
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

// Once a game begins the pac man intro sound will begin (for fun :P)
function startGameSound() {
    myMusic = new sound("pac-man-intro.mp3");
    myMusic.play();
}

// Upon player 1 selecting location their sound will play
function player1Sound() {
    var p1Sound = new sound("8bitgame1.wav");
    p1Sound.play();
}


// Upon player 2 selecting location their sound will play
function player2Sound() {
    var p2Sound = new sound("8bitgame2.wav");
    p2Sound.play();
}

// Iterate over row templates setup in objects.js to match a winning template defined in rowCombinations
function rowWin() {
    for ( var k = 0; k < boardRows.length; k++){
        for ( var i = 0; i < rowCombinations.length; i++) {
            if (JSON.stringify(boardRows[k]) === JSON.stringify(rowCombinations[i]) && boardRows[k][i] === 1) {
                player = '1';
                return [true, player];
            } else if (JSON.stringify(boardRows[k]) === JSON.stringify(rowCombinations[i]) && boardRows[k][i] === 0) {
                player = '2';
                return [true, player];
            }
        }
    }
}

// Checks variables created in objects.js to see if an index matches the winning value of 3
function colWin() {    
    for (var i = 0; i < player1Cols.length; i++) {
        if (player1Cols[i] === 3) {
            player = '1';
            return [true, player];
        } else if (player2Cols[i] === 3) {
            player = '2';
            return [true, player];
        }
    }
}

// checks for a win in diagonal cross - this is done by checking the variable 'diagonalCombinations[i]' to see if the nested array indexes all equal either 0 or 1. I used the rowCombinations variable to compare in the IF statement as it was already defined and saved me from creating another variable.
function diagonalWin() {
    for (var i = 0; i < diagonalCombinations.length; i++) {
        if (JSON.stringify(diagonalCombinations[i]) === JSON.stringify(rowCombinations[0])) {
            player = '1';

            return [true, player];
        } else if (JSON.stringify(diagonalCombinations[i]) === JSON.stringify(rowCombinations[1])) {
            player = '2';

            return [true, player];
        } else
        {
            continue;
        }
    }
}

// When called the grid is unable to be clicked upon
function disableGameClicks() {
    for ( var i = 0; i < gameTemplate.length; i++) {
        gameTemplate[i].style.pointerEvents = 'none';
    }
}

// Saves the players win to local storage
function storeWin(player) {
    var playerWinCount = localStorage.getItem(player);
    
    if (player === 1) {
        playerWinCount++;
        localStorage.setItem(player, playerWinCount);
    } else {
        playerWinCount++;
        localStorage.setItem(player, playerWinCount);
    }
}

// Checks the gameCounter variable and if it is equal to the board length then the game is a tie.
function checkDraw(){
    if (gameCounter === gameTemplate.length)
    {

        return true;
    }
}

// After reseting a game a bug occured where the counters would produce a true win - initialising each counter to null or 0 fixed this issue
function resetCounterVariables() {
    player1Cols = [0,0,0];
    player2Cols = [0,0,0];
    player1.currentGameCounter = 0;
    player2.currentGameCounter = 0;
    diagonalCombinations[0] = [null,null,null];
    diagonalCombinations[1] = [null,null,null];

    winnerDisplay.textContent = ``;
}

// After player has selected the play again button, resets the grid to empty
function resetGrid() {
    gameCounter = 0;
    var imageTemplate = document.querySelectorAll('.image');

    for (var k = 0; k < board.length; k++) {
        for ( var x = 0; x < board[k].length; x++) {
            board[k][x] = null;
        }
    }
    
    for ( var i = 0; i < gameTemplate.length; i++) {
        gameTemplate[i].style.pointerEvents = 'auto';
    }

    for (var x = 0; x < imageTemplate.length; x++) {
        imageTemplate[x].parentNode.removeChild(imageTemplate[x]);
    }    

    resetCounterVariables();
    // setPlayerOptions();
    var resetBtnDiv = document.querySelector('.replay');
    var addResetBtn = document.querySelector('.btn-play-again');

    resetBtnDiv.removeChild(addResetBtn);
    startTimer(sessionTimer);

}

// Once game has completed generates a reset game button
function resetGame() {
    var resetBtnDiv = document.querySelector('.replay');
    var addResetBtn = document.createElement('button');
    addResetBtn.classList.add('btn-play-again');
    addResetBtn.innerHTML = "Play again!";  

    resetBtnDiv.appendChild(addResetBtn);
}

// Check each function for a true condition on a winner
function checkWin() {
    if (rowWin() || colWin() || diagonalWin()){
        var playAgain = document.querySelector('.replay');
  
        if (player === '1') {
            player = 1;
            player1.winCounter++;
            var name = player1.playerName;
        } else {
            player = 2;
            player2.winCounter++;
            var name = player2.playerName
        }

        disableGameClicks();
        storeWin(player);
        clearInterval(window.idVar);
        countdownDisplay.style.display = 'none';
        document.querySelector('#time').style.display = 'none';
        winnerDisplay.textContent = `The winner is player: ${name}.`;

        resetGame();
        playAgain.addEventListener('click', resetGrid);

        mySound = new sound("Victory.mp3");
        mySound.play();

    } else if (checkDraw()) {
        var playAgain = document.querySelector('.replay');
       
        winnerDisplay.textContent = `Game is a tie, no winners.`;
        resetGame();
        playAgain.addEventListener('click', resetGrid);
    } 
}

// Displays the current players turn to the HTML document
function updatePlayer(player){
    var displayPlayerTurn = document.querySelector('.player-turn');

    if (player === 0){
        displayPlayerTurn.textContent = player1.playerName;
        
    } else {
        displayPlayerTurn.textContent = player2.playerName;
        
    }
}

// Function to increment the column counter per the respective player to be used in function colWin()
function columnCounter(position, player) {
    if (player === 1) {
        player1Cols[position]++; 
    } else {
        player2Cols[position]++; 
    }
}

// Function to update the array template (knows what to update based on the class of the click event)
function updateBoard(event, player) {
    var event = event.target;
    var col = 0;

    updatePlayer(player);

    if (event.classList.contains('col-one-row-one')) {
        var [index, start] = [0,0];
        diagonalCombinations[0][0] = player;
    } else if (event.classList.contains('col-two-row-one')){
        var [index, start] = [0,1];
        col = 1;
    } else if (event.classList.contains('col-three-row-one')){
        var [index, start] = [0,2];
        col = 2;
        diagonalCombinations[1][2] = player;
    } else if (event.classList.contains('col-one-row-two')){
        var [index, start] = [1,0];
    } else if (event.classList.contains('col-two-row-two')){
        var [index, start] = [1,1];
        col = 1;
        diagonalCombinations[0][1] = player;
        diagonalCombinations[1][1] = player;
    } else if (event.classList.contains('col-three-row-two')){
        var [index, start] = [1,2];
        col = 2;
    } else if (event.classList.contains('col-one-row-three')){
        var [index, start] = [2,0];
        diagonalCombinations[1][0] = player;
    } else if (event.classList.contains('col-two-row-three')){
        var [index, start] = [2,1];
        col = 1;
    } else {
        var [index, start] = [2,2];
        col = 2;
        diagonalCombinations[0][2] = player;
    }

    board[index].splice(start, 1, player)

    columnCounter(col, player);
    checkWin(player);
}

// Handles the click event - checks which players turn it is, displays if game is over
function handleClick(event) {
    var turn = checkPlayerTurn()
    var player = null;
    gameCounter++;

    if (turn) {
        player = 1;
        var img = document.createElement("IMG");
        img.setAttribute("src", player1.token);
        img.setAttribute("width", "75");
        img.setAttribute("height", "75");
        img.className = "image";
        event.target.appendChild(img);
        event.target.style.pointerEvents = 'none';
    } else {    
        player = 0;
        var img = document.createElement("IMG");
        img.setAttribute("src", player2.token);
        img.setAttribute("width", "75");
        img.setAttribute("height", "75");
        img.className = "image";
        event.target.appendChild(img);
        event.target.style.pointerEvents = 'none';
    }

    updateBoard(event, player);
}

// Basic function which increments on each turn and selects which players turn
function checkPlayerTurn(){
    if (player1.currentGameCounter < player2.currentGameCounter || player1.currentGameCounter === player2.currentGameCounter) {
        player1.currentGameCounter++;
        displayHover1.classList.remove('highlightCurrentPlayer');
        displayHover2.classList.add('highlightCurrentPlayer');
        spaceInvaderP1.style.visibility = 'hidden';
        spaceInvaderP2.style.visibility = 'visible';
        player1Sound();
        return true;
    } else {
        player2.currentGameCounter++;
        displayHover2.classList.remove('highlightCurrentPlayer');
        displayHover1.classList.add('highlightCurrentPlayer');
        spaceInvaderP1.style.visibility = 'visible';
        spaceInvaderP2.style.visibility = 'hidden';
        player2Sound();
        return false;
    }
}

// Function for the timer countdown
function startTimer(duration) {
    startGameSound();

    var display = document.querySelector('#time');
    var timer = duration, minutes, seconds;
    display.style.display = 'initial';
    countdownDisplay.style.display = 'initial';

    window.idVar = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            display.textContent = `Game is a tie, no winners.`;
            countdownDisplay.style.display = 'none';
            clearInterval(idVar);
            resetCounterVariables();
            disableGameClicks();
            resetGame();
            var playAgain = document.querySelector('.replay');
            playAgain.addEventListener('click', resetGrid);
        }
    }, 1000);
}

// Will set the token input on the front board depending on the user selection in the user options
function setTokenImage(player) {
    if (player.token === 'Mario') {
        player.token = 'img/mario.png';
    } else if (player.token === 'Ghost') {
        player.token = 'img/ghost.png';
    } else if (player.token === 'Heart') {
        player.token = 'img/heart.png';
    } else if (player.token === 'Pokeball') {
        player.token = 'img/pokeball.png';
    } else if (player.token === 'X') {
        player.token = 'img/X.png';
    } else {
        player.token = 'img/O.png';
    }
}

// Upon submit of game options form this function updates the players objects and calls the timer function with the parameters input on form.
function setPlayerOptions() {
    checkPlayerTurn();

    var player1Name = document.querySelector('#p1-name');
    var player2Name = document.querySelector('#p2-name');
    var player1Token = document.querySelector('#p1-token');
    var player2Token = document.querySelector('#p2-token');
    var firstPlay = document.querySelector('#first-player').value;
    var gameOptionForm = document.querySelector('.user-options');
    var mainScreen = document.querySelector('.main').style.visibility = 'visible';
    var headerDecrease = document.querySelector('header').classList.add('class-in-main-screen');

    if (firstPlay === "player1") {
        player2.currentGameCounter = 1;
    } else if (firstPlay === "random") {
        var random = Math.floor((Math.random() * 2));
        if (random === 1) {
            player2.currentGameCounter = 1;
        } else {
            player1.currentGameCounter = 1;
        }
    } else {
        player1.currentGameCounter = 1;
    }

    player1.playerName = player1Name.value;
    player2.playerName = player2Name.value;
    player1.token = player1Token.value;
    player2.token = player2Token.value;

    setTokenImage(player1);
    setTokenImage(player2);

    displayHover1.textContent = player1.playerName;
    displayHover2.textContent = player2.playerName;

    var timer = document.querySelector('#timer').value;
    sessionTimer = timer;
    startTimer(timer);

    gameOptionForm.style.display = 'none';
    countdownDisplay.style.display = 'inline';
}

// Active for loop listening for clicks on the query selector
for ( var i = 0; i < gameTemplate.length; i++) {
    gameTemplate[i].addEventListener('click', handleClick)
}

// Event listener to submit user input for game options
userOptionBtn.addEventListener('click', setPlayerOptions);
