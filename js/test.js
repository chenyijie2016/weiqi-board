function test() {
    // $.get('http://localhost:5000/sgf/123', function (data) {
    //     console.log(data);
    // });

    var board = '';
    for (var i = 0; i < 19; i++)
        for (var j = 0; j < 19; j++) {
            board = board + game.board[i + j * 19].toString();
        }


    $.post('http://127.0.0.1:5000/score', {'board': board, 'player_to_move': -1}, function (data) {
        console.log(data);
        game.showScores(data['board'])
    })


    // $.ajax(
    //     {
    //         type:'GET',
    //         url:'http://localhost:5000/sgf/123',
    //         headers: {
    //             'accept':'application/json',
    //             'Access-Control-Allow-Origin':'*'
    //         },
    //         success:function (data) {
    //             console.log(data);
    //         }
    //     }
    // )
}