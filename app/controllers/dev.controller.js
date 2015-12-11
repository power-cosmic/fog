var config = require('../../config/config'),
    fs = require('fs'),
    fstream = require('fstream'),
    Game = require('../models/dev/game'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    unzip = require('unzip2'),
    url = require('url'),
    games = require('./game.controller');

exports.createNew = function(req, res) {
  res.render('dev/pages/newGame', {
    cookie: req.cookies
  });
};

exports.readPending = function(req, res) {
  res.render('dev/pages/pending', {
    game: req.game,
    status: 'pending',
    cookie: req.cookies
  });
};

var extract = function(game) {
  var inputPath = './uploads/games/pending/' + game.files.compressed,
      outputPath = './uploads/games/published/'
          + game.developer,
      originalDirectoryName = game.originalFilename.replace(/\..*/, ''),
      configPath = (outputPath + '/' + game.title + '/fog.json');
  fs.createReadStream(inputPath).pipe(unzip.Extract({ path: outputPath }));
};

exports.acceptGame = function(req, res, next) {
  var game = req.game,
      inputPath = './uploads/games/pending/' + game.files.compressed,
      outputPath = './uploads/games/published/'
          + game.developer,
      originalDirectoryName = game.originalFilename.replace(/\..*/, ''),
      configPath = (outputPath + '/' + game.originalFilename + '/fog.json');

  fs.createReadStream(inputPath).pipe(
    unzip.Extract({ path: outputPath }).on('close', function(err) {
      var gameConfig = JSON.parse(fs.readFileSync(configPath));

      MongoClient.connect(config.db, function(err, db) {
        db.collection('games').insert({
          title: game.title,
          price: game.price,
          description: game.description,
          gamePath: game.developer + '/' + originalDirectoryName + '/',
          config: gameConfig,
          developer: game.developer
        }, function (err, game) {
            req.game = game;
            db.close();
            res.json({
              status: 'success'
            });
        });
      });
  }));

};

var sanitize = function(str) {
  return str.replace(/\s+/, '_')
    .replace(/[^a-zA-Z_]/, '');
};

exports.pendingFile = function(req, res) {
  res.download(
    './uploads/games/pending/' + req.game.files.compressed,
    req.game.sanitizedTitle + '.zip'
  );
};

exports.pendingGameById = function(req, res, next, id) {
  exports.findPendingGame(req, res, next, {'_id': ObjectId(id)});
};

exports.pendingGameByFile = function(req, res, next, id) {
  console.log('id::::: ', id)
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

exports.restrict = function(req, res, next) {
  if (req.session.user && req.session.user.type === 'developer') {
    next();
  } else {
    res.render('common/pages/restricted', {
      restrictedMessage: 'Area Restricted to Developers Only'
    });
  }
};

exports.listDevGames = function(req, res) {
  var predicate = {"developer": req.session.user.username};
  games.getGames(predicate, function(games){
    res.render('dev/pages/dev-games',
      {games: games}
    );
  });
};
