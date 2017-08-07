

var app = {};
var EDGE = 20;
var LENGTH = 25;
var R = 12;

var game = {
    drawChess: function (x, y, side)
    {
        if (side === 2)
        {
            app.ctx.fillStyle = "rgb(255,255,255)";
        }
        else
        {
            app.ctx.fillStyle = "rgb(0,0,0)";
        }

        app.ctx.beginPath();
        app.ctx.arc(EDGE + LENGTH * x, EDGE + LENGTH * y, R, 0, Math.PI * 2);
        app.ctx.fill();
    },

    setup: function ()
    {
        this.canvas = $("#ChessBoard")[0];
        app.canvas = this.canvas;
        this.ctx = this.canvas.getContext("2d");
        app.ctx = this.ctx;
        this.drawBackground();

        //set empty game board
        this.board = [];
        for (var i = 0; i < 361; i++)
            this.board.push(0);

        this.canvas.addEventListener("click", function (evt)
        {
            var mousePos = getMousePos(app.canvas, evt);
            var pos = calculatePos(mousePos);
            if (pos)
            {
                game.drawChess(pos.x, pos.y, 1);
            }
            console.log(mousePos.x, mousePos.y);
        });


    }
    ,


    drawBackground: function ()
    {
        this.ctx.fillStyle = "#D9884B";
        this.ctx.fillRect(0, 0, 500, 500);

        //draw lines
        this.ctx.fillStyle = "#000000";
        for (var i = 0; i < 18; i++)
            for (var j = 0; j < 18; j++)
            {
                this.ctx.strokeRect(EDGE + LENGTH * i, EDGE + LENGTH * j, LENGTH, LENGTH);
            }


        //draw stars
        function drawStar(x, y)
        {
            app.ctx.beginPath();
            app.ctx.arc(EDGE + LENGTH * x, EDGE + LENGTH * y, LENGTH / 5, 0, Math.PI * 2);
            app.ctx.fill();
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

    flush: function ()
    {
        for (var i = 0; i < 18; i++)
            for (var j = 0; j < 18; j++)
            {
                if (this.board[i + j * 19] !== 0)
                {
                    this.drawChess(i, j, this.board[i + j * 19]);
                    console.log(i, j, this.board[i + j * 19]);
                }
            }


    }


};

function getMousePos(canvas, evt)
{
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function calculatePos(Pos)
{
    var x = Pos.x - EDGE;
    var y = Pos.y - EDGE;

    x = x / LENGTH;
    y = y / LENGTH;

    console.log(x, y);
    var X = Math.floor(x);
    var Y = Math.floor(y);

    if (x - X >= 0.6)
        x = X + 1;
    else
    {
        if (x - X <= 0.4)
            x = X;
        else
            return false;
    }
    if (y - Y >= 0.6)
        y = Y + 1;
    else
    {
        if (y - Y <= 0.4)
            y = Y;
        else
            return false;
    }


    return {x: x, y: y};

}

