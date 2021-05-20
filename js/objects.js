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

var diagonalCombinations = [
        [
            board[0][0], board[1][1], board[2][2]
        ],
        [
            board[0][2], board[1][1], board[2][0]
        ]
    ];


var boardRows = [board[0], board[1], board[2]];
var player1Cols = [0,0,0];
var player2Cols = [0,0,0];

var player1 = {
    currentGameCounter: 0
}

var player2 = {
    currentGameCounter: 0
}

var gameCounter = 0;
var gameTemplate = document.querySelectorAll('.tic-tac-toe > * > *');

var player1WinCount = document.querySelector('.p1-score');
var player2WinCount = document.querySelector('.p2-score');

player1WinCount.innerHTML = localStorage.getItem(1);
player2WinCount.innerHTML = localStorage.getItem(2);