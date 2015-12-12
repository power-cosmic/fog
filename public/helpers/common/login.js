$(function() {
  var $form = $('#login');

  $form.append('button').html('Log In').css('float', 'right').attr('type', 'button').click(function() {
    var uval = $form.element[0]['username'].value, pval = $form.element[0]['password'].value;
    ajaxer.post('/login',
      {
        username: uval,
        password: pval,
        login: true
      }, {
        onSuccess: function(response) {
          response = JSON.parse(response);
          console.log(response, response.status);
          if (response.status == 'success') {
            window.location.href = response.url || location.href;
          } else {
            $('#login-response').html(response.message);
          }
        },
        onFail: function(response) {

          console.log('fic + ' + response);
        }
      });
  });

});
