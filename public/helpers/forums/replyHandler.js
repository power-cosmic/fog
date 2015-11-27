

$(function() {
  ajaxer.get('/helpers/forums/replyForm.html', '', function(form) {

    var $currentReplyForm = null;

    $('.reply-button').click(function(event) {
      if ($currentReplyForm) {
        $currentReplyForm.remove();
      }

      // create the thing
      var $div = $(event.target).parent();
      $currentReplyForm = $div.append('div');
      $currentReplyForm.html(form);
      $('#reply-content').focus();

      // handle cancel
      $('#cancel-reply').click(function(event) {
        $currentReplyForm.remove();
        $currentReplyForm = null;
        return false;
      });

      // handle submit
      $('#submit-reply').click(function(event) {
        var data = {content: $('#reply-content').text()};
        ajaxer.post('/forums/posts/42',
          data,
          function(response) {
            console.log(response);
          }
        );

        return false;
      });

      return false;
    });
  });
});
