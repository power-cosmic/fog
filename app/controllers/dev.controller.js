var config = require('../../config/config'),
    Game = require('../models/dev/game'),
    MongoClient = require('mongodb').MongoClient,
    url = require('url');

exports.createNew = function(req, res) {
  res.render('dev/pages/newGame');
};

exports.readPending = function(req, res) {
  console.log('GGG', req.game)
  res.render('dev/pages/pending', {
    game: req.game,
    status: 'pending'
  });
};

exports.addNew = function(req, res) {

  var body = req.body,
      file = req.file,
      filePath = '/' + file.path.replace(/(\.\.\/)*/, ''),
      fileName = file.path.replace(/(.*\/)*/, '');

  MongoClient.connect(config.db, function(err, db) {
    if (err) {
      console.log('error: ' + err);
    }
    var newGame = new Game(body.gameTitle, 'thoffma7.dev', {
      compressed: fileName
    }, body.description, body.instructions);
    db.collection('pendingGames').insertOne(newGame);
    db.close();
    res.redirect('/dev/games/pending/' + fileName);
    // res.json({
    //   status: 'success',
    //   destination: '/dev/games/pending/' + fileName
    // });
  });

};

exports.pendingFile = function(req, res) {
  res.download(
    './uploads/games/pending/' + req.game.files.compressed,
    'game.zip'
  );
};

exports.pendingGameById = function(req, res, next, id) {
  MongoClient.connect(config.db, function(err, db) {
    try {
      db.collection('pendingGames').findOne({'files.compressed': id},
        function (err, game) {
          console.log('g', game)
          req.game = game;
          db.close();
          next();
      });
    } catch (e) {
      console.log('no pending games!');
      next();
    }
  });

}
