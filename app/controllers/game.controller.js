var config = require('../../config/config'),
    fs = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    unzip = require('unzip');

exports.play = function(req, res) {
  var game = req.game;
  console.log('play', game);
  res.render('games/pages/game', {
    title: game.title,
    scripts: game.config.scripts || [],
    styles: game.config.styles || [],
    startingPoint: game.config.startingPoint,
    gamePath: req.game.gamePath
  });
};

exports.accept = function(req, res) {
  console.log("ACCEPT GAME");
  console.log(req.game)
  var game = req.game,
      inputPath = './uploads/games/pending/' + game.files.compressed,
      outputPath = './uploads/games/published/' + game.developer,
      originalDirectoryName = game.originalFilename.replace(/\..*/, ''),
      configPath = (outputPath + '/' + game.title + '/fog.json');
          //.replace(/ /, '\\ ');

  console.log('in:', inputPath);
  console.log('out', outputPath)
  console.log('!!! ' + configPath);

  fs.createReadStream(inputPath).pipe(
    unzip.Extract({ path: outputPath }).on('close', function(err) {
      console.log('configPath', configPath);
      var gameConfig = JSON.parse(fs.readFileSync(configPath));

      MongoClient.connect(config.db, function(err, db) {
        db.collection('games').update(game, {
          $set: {
            gamePath: game.developer + '/' + originalDirectoryName + '/',
            config: gameConfig,
            status: 'accepted'
          },
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

exports.download = function(req, res) {
  console.log('DOWNLOAD PENDING')
  console.log(req.game)
  res.download(
    './uploads/games/pending/' + req.game.files.compressed,
    req.game.title + '.zip'
  );
};

exports.readPending = function(req, res) {
  res.render('dev/pages/pending', {
    game: req.game
  });
}

exports.create = function(req, res) {
  var body = req.body,
      file = req.file,
      filePath = '/' + file.path.replace(/(\.\.\/)*/, ''),
      fileName = file.path.replace(/(.*\/)*/, '');
      //sanitizedTitle = sanitize(body.gameTitle.replace(/\..*/, ''));
      //sanitizedFileName = sanitize(file.originalname);

  console.log(body);

  MongoClient.connect(config.db, function(err, db) {
    if (err) {
      console.log('error: ' + err);
    }
    // var newGame = new Game(body.gameTitle, 'thoffma7.dev', {
    //   compressed: fileName
    // }, body.description, body.instructions);
    db.collection('games').insertOne({
      title: body.gameTitle,
      description: body.description,
      //sanitizedTitle: sanitizedTitle,
      developer: 'thoffman_dev',
      originalFilename: file.originalname,
      status: 'pending',
      price: body.price,
      files: {
        compressed: fileName
      }
    }, function(err, inserted) {
      inserted = inserted.ops[0];
      console.log('---')
      console.log(err, inserted);
      console.log('---')
      db.close();
      console.log('CREATED')
      res.redirect('/game/pending/' + inserted._id);
    });
  });

};

exports.getById = function(req, res, next, id) {
  MongoClient.connect(config.db, function(err, db) {
    try {
      db.collection('games').findOne({_id: ObjectId(id)},
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
