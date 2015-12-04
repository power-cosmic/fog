var game = require('../controllers/game.controller'),
    multer = require('multer'),
    gameUploads = multer({dest: './uploads/games/pending'});

module.exports = function(app) {

  var gameSubmit = gameUploads.fields([
    {name: 'gameFile', maxCount: 1},
    {name: 'icon', maxCount: 1},
    {name: 'images', maxCount: 16}
  ]);

  app.route('/game/:id/play')
    .get(game.play);

  app.route('/game/pending/:id')
    .get(game.readPending);

  app.route('/game/:id/accept')
    .post(game.accept);

  app.route('/game/:id/download')
    .get(game.download);

  app.route('/game/create')
    .post(gameSubmit, game.create);

  app.param('id', game.getById);
};
