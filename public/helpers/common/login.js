$(function() {
  var $form = $('#login');

  $form.append('button').html('Log In').css('float', 'right').click(function() {
    $form.submit();
  });
});
