$(function() {

  $('#reset-user').click(function(event) {
    $('form').toArray()[1].reset();
  });

  $('#submit-user').click(function(event) {
    // $('form').toArray()[1].submit(); //so bad
  });

});
