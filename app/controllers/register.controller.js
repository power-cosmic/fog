var User = require('../models/users/user'),
  MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  database = require('../../config/config').db;

exports.begin = function(req, res) {
  res.render('register/pages/register-home', {
    values: User.vals
  });
};

exports.login = function(req, res) {
  var out = 'err';
  MongoClient.connect(database, function(err, db) {
    console.log('1');
    console.log(req.body.username);
    try {
      db.collection('users').findOne(
        {
          $and: [
            {"username": req.body.username},
            {"password": req.body.password}
          ]
        },
        function (err, doc) {
          if (doc === null) {
            res.render('common/pages/index');
          } else {
            req.session.user = User.fromMongo(doc);
            res.render('common/pages/index');
          }
          db.close();
      });
    } catch (e) {
      res.render('common/pages/index');
    }
  });
};

exports.auth = function(req, res) {
  // var lookup = login(req.cookies['username'], req.cookies['password']);
  var lookup = login(req.body['username'], req.body['password']);
  console.log(lookup);
  res.end(lookup);
  // res.render('register/pages/register-home', {
  //   values: [req.body['username'], req.body['password']]
  // });
};

exports.create = function(req, res) {
  MongoClient.connect(database, function(err, db) {
    console.log(req.body);
    try {
      /*
      var user = new User(req.body.username, req.body.password,
        req.body.firstName, req.body.lastName,
        req.body.email, req.body.phoneNumber, req.body.type);
      */
        //console.log(user.toMong());
        //console.log(user);
        //console.log('hello');

      db.collection('users').insertOne(req.body,
        function (err, result) {
          if(result === null) {
            res.send('failed to create new user!');
          } else {
            console.log(result);
            var user = new User.fromMongo(result.ops[0]);
            req.session.user = user;
            console.log(req.session.user);
            res.render('common/pages/index');
          }
          db.close();
          //res.render('common/pages/index');
      });
    } catch (e) {
      //console.log('UserNotFound: ' + userName);
      //res.render('/common/pages/index');
    }
  });
};

exports.logout = function(req, res) {
  req.session.user = undefined;
  res.render('common/pages/index');
};
