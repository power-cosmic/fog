var User = require('../models/users/user'),
  MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  database = require('../../config/config').db;

exports.tokens = function(req, res) {
  res.render('admin/pages/new-admin');
};

exports.auth = function(req, res, next) {
  var user = req.session.user;
  if (user && user.type === 'admin') {
    next();
  } else {
    var userName = user? user.userName: 'anon';
    res.render('common/pages/restricted', {
      restrictedMessage: userName + ' is not in the sudoers file. '
          + 'This incident will be reported.'
    });
  }
};
