var User = require('../models/users/user'),
  MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  database = require('../../config/config').db;

exports.begin = function(req, res) {
  res.render('register/pages/register-home', {
    values: User.vals
  });
};
