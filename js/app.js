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

function diagonalWin() {

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

// Check each function for a true condition on a winner
function checkWin() {
    if (rowWin() || colWin() || diagonalWin()){
        console.log(`Game over player ${player} wins`);

        if (player === '1') {
            player1.winCounter++;
        } else {
            player2.winCounter++;
        }

        for ( var i = 0; i < gameTemplate.length; i++) {
            gameTemplate[i].style.pointerEvents = 'none';
        }

        alert(`Player ${player} has won!!`);

        storeWin(player);
    }
}

// Displays the current players turn to the HTML document
function updatePlayer(player){
    var displayPlayerTurn = document.querySelector('.player-turn');

    if (player === 0){
        displayPlayerTurn.textContent = 'Player 1';
    } else {
        displayPlayerTurn.textContent = 'Player 2';
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

    if (event.classList.contains('col-one-row-one')) {
        board[0].splice(0, 1, player);
        columnCounter(0, player)
    } else if (event.classList.contains('col-two-row-one')){
        board[0].splice(1, 1, player);
        columnCounter(1, player)
    } else if (event.classList.contains('col-three-row-one')){
        board[0].splice(2, 1, player);
        columnCounter(2, player)
    } else if (event.classList.contains('col-one-row-two')){
        board[1].splice(0, 1, player);
        columnCounter(0, player)
    } else if (event.classList.contains('col-two-row-two')){
        board[1].splice(1, 1, player);
        columnCounter(1, player)
    } else if (event.classList.contains('col-three-row-two')){
        board[1].splice(2, 1, player);
        columnCounter(2, player)
    } else if (event.classList.contains('col-one-row-three')){
        board[2].splice(0, 1, player);
        columnCounter(0, player)
    } else if (event.classList.contains('col-two-row-three')){
        board[2].splice(1, 1, player);
        columnCounter(1, player)
    } else {
        board[2].splice(2, 1, player);
        columnCounter(2, player)
    }

    updatePlayer(player);

    checkWin(player);
}

// Handles the click event - checks which players turn it is, displays if game is over
function handleClick(event) {
    var selectedGrid = event.target;
    var turn = checkPlayerTurn()
    var player = null;
    gameCounter++;

    if (gameCounter === gameTemplate.length)
    {
        console.log('Game over!');
        console.log('Game is a draw');
    }

    if (turn) {
        var img = document.createElement("IMG");
        img.setAttribute("src", "img/x.png");
        img.setAttribute("width", "50");
        img.setAttribute("height", "50");
        event.target.appendChild(img);
        event.target.style.pointerEvents = 'none';
        // console.log('Player 1');
        player = 1;
    } else {
        var img = document.createElement("IMG");
        img.setAttribute("src", "img/O.png");
        img.setAttribute("width", "50");
        img.setAttribute("height", "50");
        event.target.appendChild(img);
        event.target.style.pointerEvents = 'none';
        // console.log('Player 2');
        player = 0;
    }

    updateBoard(event, player);
}

// Basic function which increments on each turn and selects which players turn
function checkPlayerTurn(){
    if (player1.currentGameCounter < player2.currentGameCounter || player1.currentGameCounter === player2.currentGameCounter) {
        player1.currentGameCounter++;

        return true;
    } else {
        player2.currentGameCounter++;

        return false;
    }
}

// WORK ON TIMER AND DIAGONAL WIN
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

window.onload = function () {
    var fiveMinutes = 60 * 5,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
};

// Active for loop listening for clicks on the query selector
for ( var i = 0; i < gameTemplate.length; i++) {
    gameTemplate[i].addEventListener('click', handleClick)
}

// function rollDice() {

// }