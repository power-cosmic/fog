

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

      // handle cancel
      $('#cancel-reply').click(function(event) {
        $currentReplyForm.remove();
        $currentReplyForm = null;
        return false;
      });

      // handle submit
      $('#submit-reply').click(function(event) {
        ajaxer.post('/forums/thread/' + threadId + '/post/',
        null,
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
