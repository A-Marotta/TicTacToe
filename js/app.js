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
        console.log('Game over!');
        console.log('Game is a draw');

        return true;
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
    } else if (checkDraw()) {
        alert(`Game is a tie, no winners.`);
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
    var col = 0;

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
    updatePlayer(player);
    checkWin(player);
}

// Handles the click event - checks which players turn it is, displays if game is over
function handleClick(event) {
    var selectedGrid = event.target;
    var turn = checkPlayerTurn()
    var player = null;
    gameCounter++;



    if (turn) {
        var img = document.createElement("IMG");
        img.setAttribute("src", "img/x.png");
        img.setAttribute("width", "75");
        img.setAttribute("height", "75");
        event.target.appendChild(img);
        event.target.style.pointerEvents = 'none';
        player = 1;
    } else {
        var img = document.createElement("IMG");
        img.setAttribute("src", "img/O.png");
        img.setAttribute("width", "75");
        img.setAttribute("height", "75");
        event.target.appendChild(img);
        event.target.style.pointerEvents = 'none';
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

// Function for the timer countdown
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

// Upon submit of game options form this function updates the players objects and calls the timer function with the parameters input on form.
function setPlayerOptions() {
    var player1Name = document.querySelector('#p1-name');
    var player2Name = document.querySelector('#p2-name');
    var gameOptionForm = document.querySelector('.user-options');

    player1.playerName = player1Name.value;
    player2.playerName = player2Name.value;

    var timer = document.querySelector('#timer').value;
    var display = document.querySelector('#time');

    startTimer(timer, display);

    gameOptionForm.style.display = 'none';

}

// Active for loop listening for clicks on the query selector
for ( var i = 0; i < gameTemplate.length; i++) {
    gameTemplate[i].addEventListener('click', handleClick)
}

// Event listener to submit user input for game options
userOptionBtn.addEventListener('click', setPlayerOptions);

// function rollDice() {

// }