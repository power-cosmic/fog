var User = require('../models/users/user'),
  MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  database = require('../../config/config').db;

exports.begin = function(req, res) {
  res.render('register/pages/register-home', {
    values: User.vals
  });
};

function login(username, password) {
  MongoClient.connect(database, function(err, db) {
    db.collection('users').findOne(
      {
        $and : [
          {"username":username},
          {"password":password}
        ]
      }, function(err, doc) {
        if (doc) {
          return doc;
        } else {
          return {
            status: 'failure',
            message: 'invalid username/password'
          };
        }
      });
  });
}

exports.auth = function(req, res) {
  res.json(login(req.body['username'], req.body['password']));
  res.render('register/pages/register-home', {
    values: [req.body['username'], req.body['password']]
  });
};
