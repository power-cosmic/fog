var User = require('../models/users/user'),
  MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectID,
  nodemailer = require('nodemailer'),
  config = require('../../config/config'),
  database = config.db,
  parseUrl = require('url').parse,
  emailCred = config.email,
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: emailCred
  }, {
    from: emailCred.user,
    headers: {}
  }),
  jasonStatham = transporter;

  var jasonStatham = transporter;;

exports.newToken = function(req, res) {
  res.render('admin/pages/new-token');
};

exports.sendToken = function(req, res) {

  var params = req.body,
      emailAddress = params.email,
      firstName = params.firstName,
      lastName = params.lastName;

  console.log(params)
  console.log(emailAddress, firstName, lastName);

  MongoClient.connect(database, function(err, db) {
    if (err) {
      console.log('error: ' + err);
      res.json({
        status: 'failure',
        message: 'couldn\'t connect to database'
      });
    } else {
      db.collection('users').insertOne({
        email: emailAddress,
        firstName: firstName,
        lastName: lastName,
        type: 'admin'
      }, function (err, inserted) {
        inserted = inserted.ops[0];
        var id = inserted._id;
        console.log('id: ' + id);
        db.close();
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
                + '<a href="' + config.url + '/admin/register/' + id
                + '">this link</a> to finalize your stuff!</p>'
          });

          res.json({
            status: 'success'
          });
        }
      });
    }
  });

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
