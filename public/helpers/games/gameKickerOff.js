$(function() {
  /*
   * get the div and the name of the
   * initializer function from its data-fn attribute
   */
  var gameDiv = $('#game').get(0);
  var fn = gameDiv.getAttribute('data-fn');

  console.log(window[fn]);
  // pass the function the game div and hand over control
  window[fn].call(window, gameDiv);
});
