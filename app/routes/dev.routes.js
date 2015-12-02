var dev = require('../controllers/dev.controller')
    multer = require('multer'),
    uploads = multer({dest: './uploads/games/pending'});

module.exports = function(app) {
  app.route('/dev/games/new/')
    .get(dev.createNew)
    .post(uploads.single('file'), dev.addNew);

  app.route('/dev/games/pending/:pendingId')
    .get(dev.readPending);

  app.route('/uploads/games/pending/:pendingId')
    .get(dev.pendingFile);

  app.param('pendingId', dev.pendingGameById);
};
