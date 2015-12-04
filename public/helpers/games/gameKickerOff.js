$(function() {
  /*
   * get the div and the name of the
   * initializer function from its data-fn attribute
   */
  var gameDiv = $('#game').element[0];
  var fn = gameDiv.getAttribute('data-fn'),
      path = gameDiv.getAttribute('data-path');

  console.log(fn);
  // pass the function the game div and hand over control
  window[fn].call(window, gameDiv, path);
});
