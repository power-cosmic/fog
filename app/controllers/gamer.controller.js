var MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,
    config = require('../../config/config'),
    database = config.db;

exports.addCard = function(req, res) {
  res.render('gamers/pages/add-card');
};

exports.auth = function(req, res, next) {
  var user = req.session.user;
  if (user && user.type === 'gamer') {
    next();
  } else {
    var username = user? user.username: 'Current user';
    res.render('common/pages/restricted', {
      restrictedMessage: username + ' is not in the sudoers file. '
          + 'This incident will be reported.'
    });
  }
};
