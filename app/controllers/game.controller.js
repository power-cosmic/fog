var config = require('../../config/config'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID;

exports.play = function(req, res) {
  res.render('games/pages/game', {
    scripts: [],
    styles: [],
    startingPoint: 'main'
  });
};

exports.getById = function(req, res, next, id) {
  MongoClient.connect(config.db, function(err, db) {
    try {
      db.collection('games').findOne({_id: id},
        function (err, game) {
          req.game = game;
          db.close();
          next();
      });
    } catch (e) {
      console.log('Game not found: ' + id);
      next();
    }
  });
};
