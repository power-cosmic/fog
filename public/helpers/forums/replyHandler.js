$(function() {
  ajaxer.get('/helpers/forums/replyForm.html', '', function(form) {

    var $currentReplyForm = null,
        getPostId = function(elem) {
          var id = elem.element[0].getAttribute('data-post');
          if (id !== null) {
            return id;
          } else {
            return getPostId(elem.parent());
          }
        },
        getThreadId = function(elem) {
          return $('#topic').element[0].getAttribute('data-post');
        };

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
        ajaxer.post('/forums/posts/',
          {
            replyTo: getPostId($currentReplyForm),
            inThread: getThreadId($currentReplyForm),
            content: $('#reply-content').text()
          },
          function(response) {
            response = JSON.parse(response);
            console.log(typeof response);
            if (response.status === 'success') {
              location.reload();
            } else {
              console.log('something went wrong :(');
            }
          }
        );

        return false;
      });

      return false;
    });
  });
});
