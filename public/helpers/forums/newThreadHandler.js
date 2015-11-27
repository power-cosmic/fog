$(function() {
  $('#submit-thread').click(function(event) {

    var params = {
      title: $('#thread-title').text(),
      content: $('#thread-content').text()
    };

    console.log(params);

    ajaxer.post('/forums/thread', params, function(response) {
      response = JSON.parse(response);

      if (response.status === 'success') {
        window.location = '/forums';
      } else {
        console.log('something went wrong');
      }
    });

    return false;
  });
});
