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
    $('.imageItem').css('position', 'relative');

    var $imageItems = $('.imageItem');

    var hasSale = 1;

    for (var i = 0; i < games.length; i++) {
      var game = games[i];
      console.log(game.sale);
      if (game.sale && game.sale !== '0') {
        addSaleFlag($($imageItems.element[i+1]), game.sale);

        //add saleFlag to secret imageItem duplicate
        if(i == games.length - 1) {
          addSaleFlag($($imageItems.element[0]), game.sale);
        }
      }
    }

    function addSaleFlag (imageItem, sale) {
      imageItem.append('div').toggleClass('sale-flag')
        .toggleClass('green').text('%' + sale + ' off');
    }

  },
  onFail: function(games) {
    console.log('fic + ' + games);
  }
});
});
