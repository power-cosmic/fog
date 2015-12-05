var express = require('express'),
    game = require('../controllers/game.controller'),
    multer = require('multer'),
    gameUploads = multer({dest: './uploads/games/pending'});

module.exports = function(app) {

  var gameSubmit = gameUploads.fields([
    {name: 'gameFile', maxCount: 1},
    {name: 'icon', maxCount: 1},
    {name: 'images', maxCount: 16}
  ]);


  app.use('/game-files', express.static('./uploads/games/published'));
  app.use('/media', express.static('./uploads/media'));

  app.route('/games/:id/play')
    .get(game.play);


  app.route('/games/new')
    .get(game.newGame);

  app.route('/games/:id')
    .get(game.readPending);

  app.route('/games/:id/accept')
    .post(game.accept);

  app.route('/games/:id/download')
    .get(game.download);

  app.route('/games/submit')
    .post(gameSubmit, game.submit);

  app.route('/store')
    .get(game.store)

  app.param('id', game.getById);
};
