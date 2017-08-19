var EDGE = 20;
var LENGTH = 25;
var R = 12;
var BLACK = 1;
var WHITE = 2;
var API_URL = 'http://localhost:5000';
var app = {};


var game = {
    isInit: false,

    init: function () {
        if (!this.isInit) {
            this.canvas = $("#ChessBoard")[0];
            this.ctx = this.canvas.getContext("2d");

            this.canvas.addEventListener("click", function (evt) {
                var mousePos = getMousePos(game.canvas, evt);
                var pos = calculatePos(mousePos);
                if (pos) {
                    game.playAt(pos.x, pos.y, game.side);
                    //game.board[pos.x + pos.y * 19] = 1;
                    //game.drawChess(pos.x, pos.y, 1);
                    changeSide();
                    game.flush();
                }
                //console.log(mousePos.x, mousePos.y);
            });
            this.isInit = true;
        }
    },

    drawChess: function (x, y, side) {
        if (side === WHITE) {
            game.ctx.fillStyle = "rgb(240,240,240)";
        }
        else {
            game.ctx.fillStyle = "rgb(15,15,15)";
        }

        game.ctx.beginPath();
        game.ctx.arc(EDGE + LENGTH * x, EDGE + LENGTH * y, R, 0, Math.PI * 2);
        game.ctx.fill();
    },

    setup: function () {

        this.drawBackground();
        //set empty game board
        this.board = [];
        for (var i = 0; i < 361; i++)
            this.board.push(0);

        game.side = BLACK;

        //save all steps
        game.step = [];

    }
    ,

    drawBackground: function () {
        //set background color
        this.ctx.fillStyle = "#D9884B";
        this.ctx.strokeStyle = "#000000";
        this.ctx.fillRect(0, 0, 500, 500);

        //draw lines
        this.ctx.fillStyle = "#000000";
        for (var i = 0; i < 18; i++)
            for (var j = 0; j < 18; j++) {
                this.ctx.strokeRect(EDGE + LENGTH * i, EDGE + LENGTH * j, LENGTH, LENGTH);
            }


        //draw stars
        function drawStar(x, y) {
            game.ctx.beginPath();
            game.ctx.arc(EDGE + LENGTH * x, EDGE + LENGTH * y, LENGTH / 5, 0, Math.PI * 2);
            game.ctx.fill();
        }

        drawStar(3, 3);
        drawStar(3, 9);
        drawStar(3, 15);
        drawStar(9, 3);
        drawStar(9, 9);
        drawStar(9, 15);
        drawStar(15, 3);
        drawStar(15, 9);
        drawStar(15, 15);

    }
    ,

    flush: function () {
        game.ctx.clearRect(0, 0, 500, 500);
        game.drawBackground();

        for (var i = 0; i <= 18; i++)
            for (var j = 0; j <= 18; j++) {
                if (this.board[i + j * 19] !== 0) {
                    this.drawChess(i, j, this.board[i + j * 19]);
                    //console.log(i, j, this.board[i + j * 19]);
                }
            }
    }
    ,

    playAt: function (x, y, side) {
        if (this.board[x + y * 19] === 0) {
            this.board[x + y * 19] = side;
            this.flush();
            this.saveStep();
            return true;
        }
        console.log("[playAt] ERROR:", x, y, "has been occupied");
        return false;


    },

    removeAt: function (x, y) {
        this.board[x + y * 19] = 0;
    },

    currentState: function () {
        return {
            currentSide: this.side,
            currentBoard: this.board,
            historyStep: this.step,
            count: this.step.length
        };

    },

    saveStep: function () {
        this.step.push(this.board)
    },

    showScores: function (board) {
        if (board.length !== 361) {
            console.log("[showScores] ERROR: incomplete dada -- length", board.length);
            return;
        }

        for (var i = 0; i < 19; i++)
            for (var j = 0; j < 19; j++) {
                if (board[i + j * 19] === 1) {
                    drawBox(i, j, BLACK);
                }
                else {
                    if (board[i + j * 19] === 2)
                        drawBox(i, j, WHITE);
                }

            }


        function drawBox(x, y, side) {
            if (side === BLACK) {
                game.ctx.fillStyle = "#000000";
                game.ctx.strokeStyle = "#FFFFFF";

            }
            else {
                game.ctx.fillStyle = "#FFFFFF";
                game.ctx.strokeStyle = "#000000";

            }

            //TODO：　[BUG] Incorrect Style when first showScores()

            game.ctx.strokeRect(EDGE + x * LENGTH - 4, EDGE + y * LENGTH - 4, 8, 8);
            game.ctx.fillRect(EDGE + x * LENGTH - 4, EDGE + y * LENGTH - 4, 8, 8);
        }
    }


};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function calculatePos(Pos) {
    var x = Pos.x - EDGE;
    var y = Pos.y - EDGE;

    console.log("[calculatePos] INFO:", x, y);
    x = x / LENGTH;
    y = y / LENGTH;


    var X = Math.floor(x);
    var Y = Math.floor(y);

    if (x - X >= 0.6)
        x = X + 1;
    else {
        if (x - X <= 0.4)
            x = X;
        else
            return false;
    }

    if (y - Y >= 0.6)
        y = Y + 1;
    else {
        if (y - Y <= 0.4)
            y = Y;
        else
            return false;
    }

    // make sure the chess is in range
    if (x > 18 || y > 18) {
        console.log("[calculatePos] ERROR: out of board range");
        return false;
    }

    return {x: x, y: y};

}

function changeSide() {
    if (game.side === BLACK)
        game.side = WHITE;
    else
        game.side = BLACK;

}

function getScore() {
    var board = '';
    for (var i = 0; i < 19; i++)
        for (var j = 0; j < 19; j++) {
            board = board + game.board[i + j * 19].toString();
        }

    $.post(API_URL + '/score', {'board': board, 'player_to_move': -1}, function (data) {
        console.log(data);
        game.showScores(data['board'])
    })
}

function loadSGF() {
    var target_file = $("#sgf_list").val();

    SGFViewer.currentGameName = target_file;
    SGFViewer.gotoStep(1)

    // $.get(API_URL + '/sgf/p/' + target_file, success = function (data) {
    //     console.log(data);
    //     game.board = data["board"];
    //     game.flush();
    //
    //     $('#PB').text(data["black name"]);
    //     $('#PW').text(data["white name"]);
    //     $('#winner').text(data["winner"]);
    //     $('#date').text(data["date"])
    //
    // });

}

function getSGF() {
    $.get(API_URL + '/sgf', success = function (data) {
        console.log('[getSGF] INFO: ', data)
        app.sgfs = data;

        for (var i = 0; i < app.sgfs.length; i++) {
            $('#sgf_list').append('<option >' + app.sgfs[i] + '</option>');
        }
    })
}