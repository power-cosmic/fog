$(function() {

  $('#accept-game').click(function(event) {
    var gameId = $('#accept-game').element[0].getAttribute('data-id');
    ajaxer.post('/games/' + gameId + '/accept', {}, function(response) {
      response = JSON.parse(response);
      if (response.status === 'success') {
        location.reload();
      } else {
        console.log('something went wrong');
      }
    });
  });

});
