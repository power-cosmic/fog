var config = require('../../config/config'),
    DecompressZip = require('decompress-zip'),
    fs = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    path = require('path'),
    unzip = require('unzip2');

exports.play = function(req, res) {
  var game = req.game;

  res.render('games/pages/game', {
    title: game.title,
    scripts: game.config.scripts || [],
    styles: game.config.styles || [],
    startingPoint: game.config.startingPoint,
    gamePath: '/game-files/' + req.game.gamePath
  });
};

var extract = function(game) {
  var inputPath = game.files.compressed,
      outputPath = './uploads/games/published/' + game.developer + '/',
      originalDirectoryName = game.originalFilename.replace(/\..*/, ''),
      configPath = (outputPath + '/' + originalDirectoryName + '/fog.json');

  var unzipper = new DecompressZip(inputPath);

  unzipper.on('error', function (err) {
      console.log('Caught an error');
  });

  unzipper.on('extract', function (log) {
      console.log('Finished extracting');
  });

  unzipper.extract({
      path: outputPath,
      filter: function (file) {
          return file.type !== "SymbolicLink";
      }
  });

};

exports.accept = function(req, res) {
  var game = req.game,
      inputPath = './uploads/games/pending/' + game.files.compressed,
      outputPath = './uploads/games/published/' + game.developer,
      originalDirectoryName = game.originalFilename.replace(/\..*/, ''),
      configPath = (outputPath + '/' + originalDirectoryName + '/fog.json');

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
};

exports.download = function(req, res) {
  res.download(
    req.game.files.compressed,
    req.game.originalFilename
  );
};

exports.readPending = function(req, res) {
  res.render('dev/pages/pending', {
    game: req.game
  });
}

var mkdirRecursiveSync = function(directory) {

  try {
    fs.mkdirSync(directory);
  } catch (e) {
    console.log(e)
    if (e.errno !== -17) {
      mkdirRecursiveSync(path.dirname(directory));
      fs.mkdirSync(directory);
    }
  }
};

var saveMedia = function(file, game, callback) {
  var outputDirectory = './uploads/media/' + game.developer + '/' + game.title,
      outputPath = outputDirectory + '/' + file.originalname;

  console.log('saving file: ' + outputPath);
  mkdirRecursiveSync(outputDirectory);//, function() {
  fs.renameSync(file.path, outputPath, function(data) {
    console.log('file saved: ' +  outputPath);
  });
  //});

  return outputPath;
};

exports.create = function(req, res) {
  var body = req.body,
      files = req.files;

  //console.log(files)

  var gameFile = files['gameFile'][0],
      icon = files['icon'][0],
      images = files['images'],
      filePath = './' + gameFile.path.replace(/(\.\.\/)*/, '');
      //gameFile = filePath.substring(1).replace(/(.*\/)*/, '');

  //console.log('GAMEFILE',files['gameFile']);
  //console.log(gameFile)

  console.log('GAMEFILE', gameFile);
  var tempGame = {
    title: body.gameTitle,
    developer: 'thoffman_dev'
  }

  var iconLocation = saveMedia(icon, tempGame);
  var imageLocations = [];
  images.forEach(function(image) {
    imageLocations.push(saveMedia(image, tempGame));
  });

  MongoClient.connect(config.db, function(err, db) {
    if (err) {
      console.log('error: ' + err);
    }
    db.collection('games').insertOne({
      title: body.gameTitle,
      description: body.description,
      developer: 'thoffman_dev',
      originalFilename: gameFile.originalname,
      status: 'pending',
      price: body.price,
      files: {
        compressed: filePath,
        icon: iconLocation,
        images: imageLocations
      }
    }, function(err, inserted) {
      inserted = inserted.ops[0];
      extract(inserted);
      db.close();
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
