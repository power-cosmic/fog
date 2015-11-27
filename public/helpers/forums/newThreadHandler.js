$(function() {
  $('#submit-thread').click(function(event) {

    var params = {
      title: $('#thread-title').text(),
      content: $('#thread-content').text()
    };

    console.log(params);

    ajaxer.post('/forums/thread', params, function(response) {
      response = JSON.parse(response);
      console.log(response);
    });

    return false;
  });
});
