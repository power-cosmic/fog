require(['common/bannerMaker'], function(rotatingBanner) {
  ajaxer.get('/games/featured', {quantity:4}, {
  onSuccess: function(games) {
    games = JSON.parse(games);
    var imageInfo = [];
    games.forEach(function(game) {
      imageInfo.push( {
        link: '/games/' + game._id,
        src: '/media/' + game.files['banner']
      });
    });

    rotatingBanner("#banner_window", "#prev_image",
    "#next_image", 616, 353, 300, imageInfo);
    //console.log(games);
  },
  onFail: function(games) {
    console.log('fic + ' + games);
  }
});
});
