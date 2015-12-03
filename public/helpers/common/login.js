$(function() {
  var $form = $('#login');

  $form.append('button').html('Log In').css('float', 'right').attr('type', 'button').click(function() {
    var uval = $form.element[0]['username'].value, pval = $form.element[0]['password'].value;
    ajaxer.post('/',
      {
        username: uval,
        password: pval,
        login: true
      }, {
        onSuccess: function(response) {
          // alert('yay ' + response);
          document.cookie = `loggedIn=${response}`;
          document.cookie = `username=${uval}`;
        },
        onFail: function(response) {

          console.log('fic + ' + response);
        }
      });
    // $form.submit();
  });
});
