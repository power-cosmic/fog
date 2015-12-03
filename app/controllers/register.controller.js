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
  var out = 'err';
  MongoClient.connect(database, function(err, db) {
    db.collection('users').findOne(
      {
        $and : [
          {"username":username},
          {"password":password}
        ]
      }, function(err, doc) {
        // db.close();
        if (doc) {
          out = doc;
        } else {
          out = {
            status: 'failure',
            message: 'invalid username/password'
          };
        }
      });

    db.close();
  });
  return out;
}

exports.auth = function(req, res) {
  // var lookup = login(req.cookies['username'], req.cookies['password']);
  var lookup = login(req.body['username'], req.body['password']);
  console.log(lookup);
  res.end(lookup);
  // res.render('register/pages/register-home', {
  //   values: [req.body['username'], req.body['password']]
  // });
};
