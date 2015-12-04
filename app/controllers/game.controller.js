var config = require('../../config/config'),
    DecompressZip = require('decompress-zip'),
    fs = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    unzip = require('unzip2');

exports.play = function(req, res) {
  var game = req.game;
  console.log('PLAY')
  console.log('play', game);
  res.render('games/pages/game', {
    title: game.title,
    scripts: game.config.scripts || [],
    styles: game.config.styles || [],
    startingPoint: game.config.startingPoint,
    gamePath: req.game.gamePath
  });
};

var extract = function(game) {
  var inputPath = './uploads/games/pending/' + game.files.compressed,
      outputPath = './uploads/games/published/' + game.developer + '/',
      originalDirectoryName = game.originalFilename.replace(/\..*/, ''),
      configPath = (outputPath + '/' + originalDirectoryName + '/fog.json');
          //.replace(/ /, '\\ ');

  // fs.mkdirSync(outputPath);
  // fs.createReadStream(inputPath)
  // .pipe(unzip.Parse())
  // .on('entry', function (entry) {
  //   var fileName = entry.path;
  //   var type = entry.type; // 'Directory' or 'File'
  //   var size = entry.size;
  //   console.log(fileName);
  //   if (fileName !== ".git") {
  //     console.log(fileName);
  //     entry.pipe(fs.createWriteStream(outputPath));
  //   } else {
  //     entry.autodrain();
  //   }
  // });

  console.log('EXTRACTING');
  console.log('in:', inputPath);
  console.log('out', outputPath)
  console.log('!!! ' + configPath);

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
  console.log('done');

  // var unzipper = unzip.Extract({ path: outputPath });
  //
  // console.log('JAXING')
  // unzipper.on('error', function(err) {
  //   console.log('ERROR', err);
  // });
  // unzipper.on('close', function(fn) {
  //   console.log('CLOSE', fn);
  // });
  //
  //
  // fs.createReadStream(inputPath).pipe(unzipper);
};

exports.accept = function(req, res) {
  console.log("ACCEPT GAME");
  var game = req.game,
      inputPath = './uploads/games/pending/' + game.files.compressed,
      outputPath = './uploads/games/published/' + game.developer,
      originalDirectoryName = game.originalFilename.replace(/\..*/, ''),
      configPath = (outputPath + '/' + originalDirectoryName + '/fog.json');
          //.replace(/ /, '\\ ');

  console.log('ORIG', originalDirectoryName)
  console.log('in:', inputPath);
  console.log('out', outputPath)
  console.log('!!! ' + configPath);


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
};

exports.download = function(req, res) {
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
      extract(inserted);
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
