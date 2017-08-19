var SGFViewer = {
    currentGameName: undefined,
    currentStep: undefined,
    totalStep: undefined,

    gotoStep: function (step) {
        $.get(API_URL + '/sgf/p/' + SGFViewer.currentGameName, {'step': step}, success = function (data) {
            console.log(data);
            SGFViewer.currentStep = step;
            SGFViewer.totalStep = data['total step'];
            game.board = data['board'];
            game.flush();

            $('#PB').text(data["black name"]);
            $('#PW').text(data["white name"]);
            $('#winner').text(data["winner"]);
            $('#date').text(data["date"]);

            $('#currentstep').val(step);
            $('#totalstep').text(SGFViewer.totalStep);
        })
    },
    begin: function () {
        this.gotoStep(1);
    },
    next: function () {
        this.gotoStep(parseInt($('#currentstep').val()) + 1);
    },

    next_more:function () {
        this.gotoStep(parseInt($('#currentstep').val()) + 5);
    },
    previous: function () {
        this.gotoStep(parseInt($('#currentstep').val()) - 1);
    },

    previous_more:function () {
        this.gotoStep(parseInt($('#currentstep').val()) - 5);
    },
    end: function () {
        this.gotoStep(SGFViewer.totalStep);
    },
    goto: function () {
        this.gotoStep(parseInt($('#currentstep').val()));
    }
};


