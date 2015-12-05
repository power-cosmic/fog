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
          if (response === 'success') {
            window.location.href = '/';
          } else {
            $('#login-response').html(response);
          }
        },
        onFail: function(response) {

          console.log('fic + ' + response);
        }
      });
  });

});
