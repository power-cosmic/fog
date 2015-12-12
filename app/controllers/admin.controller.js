var User = require('../models/users/user'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    nodemailer = require('nodemailer'),
    crypto = require('crypto'),
    config = require('../../config/config'),
    database = config.db,
    gametroller = require('../controllers/game.controller'),
    parseUrl = require('url').parse,
    register = require('../controllers/register.controller')
    emailCred = config.email,
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: emailCred
    }, {
      from: emailCred.user,
      headers: {}
    }),
    jasonStatham = transporter;

exports.newToken = function(req, res) {
  res.render('admin/pages/new-token');
};

exports.sendToken = function(req, res) {

  var params = req.body,
      emailAddress = params.email;
  params.password = crypto.randomBytes(16);
  params.username = crypto.randomBytes(16);
  params.type = 'admin';

  register.register(params, function(err, user) {
    if (err) {
      res.json({
        status: 'failure',
        message: 'couldn\'t insert user into the database'
      });
    } else {
      jasonStatham.sendMail({
        from: emailCred.user,
        to: emailAddress,
        subject: 'Welcome to the fog family!',
        html: '<p>Greetings from fog! Looks like you\'re a new hire. '
            + 'To get set up as an admin, follow '
            + '<a href="' + config.url + '/admin/register/' + user._id
            + '">this link</a> and finalize your stuff!</p>'
            + '<p>fog. Imagine better.</p>'
      });

      res.render('admin/pages/token-sent', {
        email: emailAddress
      });
    }
  });

};

exports.readPending = function(req, res) {
  gametroller.getGames({
    status: 'pending'
  }, function(games) {
    res.render('admin/pages/pending', {
      games: games
    });
  })
};

exports.register = function(req, res) {
  res.render('admin/pages/register', {
    admin: req.admin
  });
};

exports.create = function(req, res) {
  var info = req.body;
  register.findById(info._id, function(err, user) {
    if (err) {
      res.json({
        status: 'failure',
        message: 'invalid id'
      })
    } else {
      var hash = register.hashAndSalt(info.password, user.salt);
      MongoClient.connect(config.db, function(err, db) {
        db.collection('users').findAndModify({
          _id: ObjectId(user._id)
        },
        [['_id','asc']],
        {
          $set: {
            username: info.username,
            firstName: info.firstName,
            lastName: info.lastName,
            email: info.email,
            phoneNumber: info.phoneNumber,
            password: hash,
          }
        }, function(err, result) {
          if (err) {
            res.json({
              status: 'failure',
              message: 'that username is taken'
            });
          } else {
            req.session.user = result.value;
            res.render('admin/pages/register-confirmation');
          }
        });
      });
    }
  });

};

exports.auth = function(req, res, next) {
  var user = req.session.user;
  if (user && user.type === 'admin') {
    next();
  } else {
    var username = user? user.username: 'Current user';
    res.render('common/pages/restricted', {
      restrictedMessage: username + ' is not in the sudoers file. '
          + 'This incident will be reported.'
    });
  }
};

exports.getById = function(req, res, next, id) {
  exports.read({ _id: ObjectId(id)}, function(admin) {
    req.admin = admin[0];
    next();
  });
};

exports.getUsers = function(req, res) {
  MongoClient.connect(config.db, function(err, db) {
    db.collection('users').find({}, function(err, cursor) {
      var gamers = [],
          devs = [];

      cursor.each(function(err, user) {
        if (user) {
          if (user.type === 'gamer') {
            gamers.push(user);
          } else if (user.type === 'dev') {
            devs.push(user);
          }
        } else {
          db.close();
          res.render('admin/pages/users', {
            gamers: gamers,
            devs: devs
          });
        }
      });
    });
  });
};

exports.setUserId = function(req, res, next, id) {
  // I'm sure there's a much better way to do this
  req.id = id;
  next();
};

exports.banUser = function(req, res, next) {
  exports.setStatus(req.id, 'banned', function(err) {
    if (err) {
      res.json({
        status: 'failure',
        message: 'unable to ban user'
      });
    } else {
      res.json({
        status: 'success'
      })
    }
  });
};

exports.unbanUser = function(req, res) {
  exports.setStatus(req.id, '', function(err) {
    if (err) {
      res.json({
        status: 'failure',
        message: 'unable to unban user'
      });
    } else {
      res.json({
        status: 'success'
      })
    }
  });
};

exports.setStatus = function(userId, status, callback) {
  MongoClient.connect(config.db, function(err, db) {
    db.collection('users').update(
      { _id: ObjectId(userId) },
      { $set: { status: status }},
      function(err, result) {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      }
    );
  });
}

exports.read = function(query, callback) {

  if (!callback) {
    callback = query;
    query = {};
  }
  query.type = 'admin'


  MongoClient.connect(config.db, function(err, db) {
    db.collection('users').find(query, function(err, cursor) {
      var admin = [];
      cursor.each(function(err, user) {
        if (user) {
          admin.push(user);
        } else {
          db.close();
          callback(admin);
        }
      });
    });
  });

};
