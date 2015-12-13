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

      //add overlays for images
      for (var i = 0; i < games.length; i++) {
        var game = games[i];
        var imageItem = $($imageItems.element[i+1]);
        addAvailabilityFlag(imageItem, game.status);
        addSaleFlag(imageItem, game.sale);
      }

      //add overlays for secret duplicate image
      addSaleFlag($($imageItems.element[0]), games[0].sale);
      addAvailabilityFlag($($imageItems.element[0]), games[0].status);

      function addSaleFlag (imageItem, sale) {
        if (game.sale && game.sale !== '0') {
          imageItem.append('div').toggleClass('sale-flag')
          .toggleClass('green').text('%' + sale + ' off');
        }
      }

      function addAvailabilityFlag (imageItem, status) {
        console.log(status);
        imageItem.append('div').toggleClass('availability')
        .text(status === 'accepted' ? 'Now Available' : 'Coming Soon');
      }

    },
    onFail: function(games) {
      console.log('fic + ' + games);
    }
  });
});
