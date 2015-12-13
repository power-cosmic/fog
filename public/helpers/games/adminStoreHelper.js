$( function() {
  var previousSale = 0;

  var features = document.getElementsByClassName('featured-button');
  var sales = document.getElementsByClassName('onsale-button');
  for (var i = 0; i < features.length; i++) {
    (function() {
      var k = i;

      sales[k].addEventListener('change', function(event) {
        var sale = sales[k];
        event.preventDefault();
        saleListener(sale);
      });

      sales[k].addEventListener('click', function(event) {
        event.preventDefault();
        var sale = sales[k];
        previousSale = sale.options[sale.selectedIndex].value;
      });

      features[k].addEventListener('click', function(event) {
        var feature = features[k];
        event.preventDefault();
        featureListener(feature);
      });
    })();
  }

  function saleListener(sale) {
    var gameID = sale.id.substr(0, sale.id.indexOf('onsale'));
    var percent = sale.options[sale.selectedIndex].value;
    ajaxer.post('/games/' + gameID + '/update-sale',
      {
        sale: percent
      }, {
        onSuccess: function(response) {
          if (response) {
            if (parseInt(previousSale) === 0 && parseInt(response) !== 0 ||
                parseInt(previousSale) !== 0 && parseInt(response) === 0)
            {
              $(sale).toggleClass('active');
              $(sale).toggleClass('green');
              $(sale).toggleClass('inactive');
            }
          }

        },
        onFail: function(response) {
          console.log('fic + ' + response);
        }
      });
  }

  function featureListener(feature) {
    var gameID = feature.id.substr(0, feature.id.indexOf('featured'));
    ajaxer.post('/games/' + gameID + '/toggle-featured',
      {
        id : gameID
      }, {
        onSuccess: function(response) {
          if (response === 'true' || response === 'false') {
            $(feature).toggleClass('active');
            $(feature).toggleClass('pizza');
            $(feature).toggleClass('green');
            $(feature).toggleClass('inactive');
          }
        },
        onFail: function(response) {
          console.log('fic + ' + response);
        }
      });
  }
});
