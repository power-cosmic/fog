var config = require('../../config/config'),
    fs = require('fs'),
    Game = require('../models/dev/game'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    unzip = require('unzip'),
    url = require('url');

exports.createNew = function(req, res) {
  res.render('dev/pages/newGame');
};

exports.readPending = function(req, res) {
  res.render('dev/pages/pending', {
    game: req.game,
    status: 'pending'
  });
};

exports.acceptGame = function(req, res) {
  var game = req.game,
      sanitizedTitle = game.title.replace(/\s+/, '_')
        .replace(/[^a-zA-Z_]/, '')
      inputPath = './uploads/games/pending/' + game.files.compressed,
      outputPath = './uploads/games/published/' + sanitizedTitle;

      // insert into real db collection
      MongoClient.connect(config.db, function(err, db) {
        db.collection('games').insert({
          title: game.title,
          description: game.description,
          url: outputPath,
          config: game.config
        }, function (err, game) {
            req.game = game;
            db.close();
            next();
        });
      });

      fs.createReadStream(inputPath).pipe(unzip.Extract({ path: outputPath }));
  res.json({
    status: 'success'
  })

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
    // var newGame = new Game(body.gameTitle, 'thoffma7.dev', {
    //   compressed: fileName
    // }, body.description, body.instructions);
    db.collection('pendingGames').insertOne({
      title: body.title,
      description: body.description,
      config: body.config,
      files: {
        compressed: fileName
      }
    });
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
  exports.findPendingGame(req, res, next, {'_id': ObjectId(id)});
};

exports.pendingGameByFile = function(req, res, next, id) {
  exports.findPendingGame(req, res, next, {'files.compressed': id});
};

exports.findPendingGame = function(req, res, next, predicate) {
  MongoClient.connect(config.db, function(err, db) {
    try {
      db.collection('pendingGames').findOne(predicate,
        function (err, game) {
          req.game = game;
          db.close();
          next();
      });
    } catch (e) {
      console.log('no pending games!');
      next();
    }
  });

};
