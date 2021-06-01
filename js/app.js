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
    if (gameCounter >= gameTemplate.length)
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
    gameOver = false;

    for ( var i = 0; i < board.length; i++) {
        for ( var x = 0; x < board[i].length; x++) {
            board[i][x] = null;
        }
    }

    if (computerReplayFirst) {
        player1.currentGameCounter = 1;
    }
    
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

    player1WinCount.innerHTML = localStorage.getItem(1);
    player2WinCount.innerHTML = localStorage.getItem(2);
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

        for ( var i = 0; i < board.length; i++) {
            for ( var x = 0; x < board[i].length; x++) {
                board[i][x] = -1;
            }
        }

        resetGame();
        playAgain.addEventListener('click', resetGrid);

        mySound = new sound("Victory.mp3");
        mySound.play();

        gameOver = true;
        clearTimeout();

    } else if (checkDraw()) {
        var playAgain = document.querySelector('.replay');
        clearInterval(window.idVar);

        winnerDisplay.textContent = `Game is a tie, no winners.`;

        for ( var i = 0; i < board.length; i++) {
            for ( var x = 0; x < board[i].length; x++) {
                board[i][x] = -1;
            }
        }

        resetGame();
        playAgain.addEventListener('click', resetGrid);

        gameOver = true;
        clearTimeout();
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

        if (player2.playerName === 'Computer') {
            computerPlay();
        }

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

// Update the board according to computers move
function computerUpdateBoard(player) {
    updatePlayer(player);
    var col = 0;
    var [index, start] = [0,0];
    board[index].splice(start, 1, player)
}

// Code block for computer logic to play
function computerPlay() {
    gameCounter++;
    player = 0;
    player2.currentGameCounter++;

    var availablePositions = [];

    setTimeout(function() {
        if (gameOver === false) {
            displayHover2.classList.remove('highlightCurrentPlayer');
            displayHover1.classList.add('highlightCurrentPlayer');
            spaceInvaderP1.style.visibility = 'visible';
            spaceInvaderP2.style.visibility = 'hidden';
        }
    }, 1000);

    setTimeout(function(){
        if (gameOver === false) {
            for ( var i = 0; i < board.length; i++) {
                var idx = board[i].indexOf(null);
                while (idx != -1) {
                    availablePositions.push(`${i}, ${idx}`);
                    idx = board[i].indexOf(null, idx + 1);
                }
            }

            var randomLocation = Math.floor(Math.random() * availablePositions.length);        
            index = availablePositions[randomLocation]

            var img = document.createElement("IMG");
            img.setAttribute("src", player2.token);
            img.setAttribute("width", "75");
            img.setAttribute("height", "75");
            img.className = "image";

            if (typeof index !== 'undefined') {
                index = index.split(', ')
                index[0] = parseInt(index[0])
                index[1] = parseInt(index[1])
                board[index[0]].splice(index[1], 1, 0)

                if (index[0] === 0 && index[1] === 0) {
                    gameTemplate[0].appendChild(img);
                    gameTemplate[0].style.pointerEvents = 'none';
                    diagonalCombinations[0][0] = 0;
                } else if (index[0] === 0 && index[1] === 1) {
                    gameTemplate[3].appendChild(img);
                    gameTemplate[3].style.pointerEvents = 'none';
                } else if (index[0] === 0 && index[1] === 2) {
                    gameTemplate[6].appendChild(img);
                    gameTemplate[6].style.pointerEvents = 'none';
                    diagonalCombinations[1][0] = 0;
                } else if (index[0] === 1 && index[1] === 0) {
                    gameTemplate[1].appendChild(img);
                    gameTemplate[1].style.pointerEvents = 'none';
                } else if (index[0] === 1 && index[1] === 1) {
                    gameTemplate[4].appendChild(img);
                    gameTemplate[4].style.pointerEvents = 'none';
                    diagonalCombinations[0][1] = 0;
                    diagonalCombinations[1][1] = 0;
                } else if (index[0] === 1 && index[1] === 2) {
                    gameTemplate[7].appendChild(img);
                    gameTemplate[7].style.pointerEvents = 'none';
                } else if (index[0] === 2 && index[1] === 0) {
                    gameTemplate[2].appendChild(img);
                    gameTemplate[2].style.pointerEvents = 'none';
                    diagonalCombinations[1][2] = 0;
                } else if (index[0] === 2 && index[1] === 1) {
                    gameTemplate[5].appendChild(img);
                    gameTemplate[5].style.pointerEvents = 'none';
                } else {
                    gameTemplate[8].appendChild(img);
                    gameTemplate[8].style.pointerEvents = 'none';
                    diagonalCombinations[0][2] = 0;
                }
                player2Sound();   
                columnCounter(index[1], 0);
            }

            checkWin()
            checkPlayerTurn()
        }
    }, 1000);
}

// Basic function which increments on each turn and selects which players turn
function checkPlayerTurn(){
    if (player2.playerName === 'Computer'){
        if (player1.currentGameCounter < player2.currentGameCounter || player1.currentGameCounter === player2.currentGameCounter) {
            player1.currentGameCounter++;
            displayHover1.classList.add('highlightCurrentPlayer');
            displayHover2.classList.remove('highlightCurrentPlayer');
            spaceInvaderP1.style.visibility = 'visible';
            spaceInvaderP2.style.visibility = 'hidden';
            player1Sound();
            return true;
        } else {
            displayHover1.classList.remove('highlightCurrentPlayer');
            displayHover2.classList.add('highlightCurrentPlayer');
            spaceInvaderP1.style.visibility = 'hidden';
            spaceInvaderP2.style.visibility = 'visible';

            if (player2.currentGameCounter === 0) {
                displayHover1.classList.remove('highlightCurrentPlayer');
                displayHover2.classList.add('highlightCurrentPlayer');
                spaceInvaderP1.style.visibility = 'hidden';
                spaceInvaderP2.style.visibility = 'visible';

                computerPlay();
            }
            
            return true;
        }
    } else if (player1.currentGameCounter < player2.currentGameCounter || player1.currentGameCounter === player2.currentGameCounter) {
        player1.currentGameCounter++;
        displayHover2.classList.add('highlightCurrentPlayer');
        displayHover1.classList.remove('highlightCurrentPlayer');
        spaceInvaderP2.style.visibility = 'visible';
        spaceInvaderP1.style.visibility = 'hidden';
        player1Sound();
        return true;
    } else {
        player2.currentGameCounter++;
        displayHover2.classList.remove('highlightCurrentPlayer');
        displayHover1.classList.add('highlightCurrentPlayer');
        spaceInvaderP2.style.visibility = 'hidden';
        spaceInvaderP1.style.visibility = 'visible';
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
    } else if (player.token === 'O') {
        player.token = 'img/O.png';
    } else {
        player.token = 'img/arcade.png'
    }
}

// Upon submit of game options form this function updates the players objects and calls the timer function with the parameters input on form.
function setPlayerOptions() {
    var player1Name = document.querySelector('#p1-name');
    var player2Name = document.querySelector('#p2-name');
    var player1Token = document.querySelector('#p1-token');
    var player2Token = document.querySelector('#p2-token');
    var firstPlay = document.querySelector('#first-player').value;
    var mainScreen = document.querySelector('.main').style.visibility = 'visible';
    var headerDecrease = document.querySelector('header').classList.add('class-in-main-screen');
    
    checkPlayerTurn();

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

function setComputerOptions() {
    var player1Name = document.querySelector('#p1-name-computer');
    var player2Name = 'Computer';
    var player1Token = document.querySelector('#p1-token-computer');
    var firstPlay = document.querySelector('#first-player-computer').value;   
    var mainScreen = document.querySelector('.main').style.visibility = 'visible';
    var headerDecrease = document.querySelector('header').classList.add('class-in-main-screen');
    
    player1.playerName = player1Name.value;
    player2.playerName = player2Name;

    player1.token = player1Token.value;
    player2.token = 'Computer';
    displayHover1.textContent = player1.playerName;
    displayHover2.textContent = player2.playerName;

    setTokenImage(player1);
    setTokenImage(player2);
    
    if (firstPlay === "player1-computer") {
        player2.currentGameCounter = 1;
    } else if (firstPlay === "random-computer") {
        var random = Math.floor((Math.random() * 2));
        if (random === 1) {
            player2.currentGameCounter = 1;
        } else {
            player1.currentGameCounter = 1;
            computerReplayFirst = true;
        }
    } else {
        player1.currentGameCounter = 1;
        computerReplayFirst = true;
    }

    checkPlayerTurn();
    
    var timer = document.querySelector('#timer-computer').value;
    sessionTimer = timer;
    startTimer(timer);
    computerOptionForm.style.display = 'none';
    countdownDisplay.style.display = 'inline';
}

function loadMutliplayerOptions() {
    var gameMode = document.querySelector('.game-mode');
    gameMode.style.visibility = 'hidden';
    gameOptionForm.style.display = 'inline';
}

function loadComputerOptions(){
    var gameMode = document.querySelector('.game-mode');
    gameMode.style.visibility = 'hidden';
    computerOptionForm.style.display = 'inline';
}

// Active for loop listening for clicks on the query selector
for ( var i = 0; i < gameTemplate.length; i++) {
    gameTemplate[i].addEventListener('click', handleClick)
}

// Event listener to submit user input for game options 
userOptionBtn.addEventListener('click', setPlayerOptions);
computerOptionBtn.addEventListener('click', setComputerOptions)

// Event listener to call the second page of options for user input
multiplayerSelection.addEventListener('click', loadMutliplayerOptions);
computerSelection.addEventListener('click', loadComputerOptions);
