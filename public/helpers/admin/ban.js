$(function() {
  $('.ban').click(function(event) {
    var id = event.target.getAttribute('data-id');
    ajaxer.post('/admin/ban/' + id, '', {
      onSuccess: function(response) {
        location.reload(true);
      },
      onFail: function(response) {
        console.log(response);
      }
    });
    return false;
  });

  $('.unban').click(function(event) {
    var id = event.target.getAttribute('data-id');
    ajaxer.post('/admin/unban/' + id, '', {
      onSuccess: function(response) {
        location.reload(true);
      },
      onFail: function(response) {
        console.log(response);
      }
    });
    return false;
  });
});
