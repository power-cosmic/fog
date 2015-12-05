var dev = require('../controllers/dev.controller');

module.exports = function(app) {

  app.route('/dev/games')
    .get(dev.restrict, dev.listDevGames);

};
