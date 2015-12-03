$(function() {


  $('#accept-game').click(function(event) {
    var gameId = $('#accept-game').element[0].getAttribute('data-id');
    console.log(gameId);
    ajaxer.post('/game/' + gameId + '/accept', {}, function(response) {
      response = JSON.parse(response);
      console.log(response)
      if (response.status !== 'success') {
        console.log('something went wrong');
      }
    });
  });

});
