var game = require('../controllers/game.controller');

module.exports = function(app) {

  app.route('/game/:id')
    .get(game.play);

  app.param('id', game.getById);
};
