var game = require('../controllers/game.controller'),
    multer = require('multer'),
    gameUploads = multer({dest: './uploads/games/pending'});

module.exports = function(app) {

  app.route('/game/:id/play')
    .get(game.play);

  app.route('/game/pending/:id')
    .get(game.readPending);

  app.route('/game/:id/accept')
    .post(game.accept);

  app.route('/game/:id/download')
    .get(game.download);

  app.route('/game/create')
    .post(gameUploads.single('gameFile'), game.create);

  app.param('id', game.getById);
};
