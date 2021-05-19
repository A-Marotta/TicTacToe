var board = [
    //    0    1    2
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ]
    

var rowCombinations = [
    [1,1,1],
    [0,0,0]
]

var boardRows = [board[0], board[1], board[2]];
var player1Cols = [0,0,0];
var player2Cols = [0,0,0];

var player1 = {
    currentGameCounter: 0,
    winCounter: 0
}

var player2 = {
    currentGameCounter: 0,
    winCounter: 0
}

var gameCounter = 0;
var gameTemplate = document.querySelectorAll('.tic-tac-toe > * > *');
