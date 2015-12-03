var dev = require('../controllers/dev.controller'),
    multer = require('multer'),
    gameUploads = multer({dest: './uploads/games/pending'}),
    configUploads = multer({dest: './uploads/configs'});

module.exports = function(app) {
  app.route('/dev/games/new/')
    .get(dev.createNew);

  app.route('/dev/games/pending/:fileId')
    .get(dev.readPending);

  app.route('/games/accept/:pendingId')
    .post(dev.acceptGame);

  app.route('/uploads/games/pending/:pendingFile')
    .get(dev.pendingFile);

  app.param('fileId', dev.pendingGameByFile);
  app.param('pendingId', dev.pendingGameById);
};
