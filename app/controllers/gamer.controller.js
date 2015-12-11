var MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,
    config = require('../../config/config'),
    database = config.db,
    creditCardFields = [
      {
        name: 'fullName',
        label: 'full name'
      },
      {
        name: 'cardType',
        type: 'select',
        width: 4,
        options: [
          {
            display: 'Visa',
            value: 'visa'
          },
          {
            display: 'MasterCard',
            value: 'masterCard'
          }
        ],
        label: 'type'
      },
      {
        name: 'cardNumber',
        width: 8,
        label: 'card number',
        pattern: '^(\\d{4}[- \\.]?){3}\\d{4}$',
        placeholder: 'XXXX-XXXX-XXXX-XXXX'
      },
      {
        name: 'expirationDate',
        label: 'expiration date',
        placeholder: 'MM-YY',
        pattern: '^\\d{2}[\\.\\/-]\\d{2}$',
        width: 5
      },
      {
        name: 'securityCode',
        label: 'security code',
        placeholder: 'CVC',
        pattern: '\\d{3}\\d?$',
        width: 3
      }
    ],
    getGardField = function(fieldName) {
      for (var i = 0; i < creditCardFields.length; i++) {
        var field = creditCardFields[i];
        if (field.name === fieldName) {
          return field;
        }
      };
    };

exports.addCard = function(req, res) {
  res.render('gamers/pages/add-card', {
    action: 'add-card',
    method: 'post',
    fields: creditCardFields,
    values: {}
  });
};

exports.submitCard = function(req, res) {

  var errors = [];
  creditCardFields.forEach(function(field) {
    var regex = (field.pattern)? new RegExp(field.pattern) : null,
        reqField = req.body[field.name],
        label = field.label;

    if (!reqField || (regex && !regex.test(reqField))) {
      errors.push({
        field: label,
        message: 'invalid entry for field ' + label
      });
    }

  });

  if (errors.length) {
    res.json({
      status: 'failure',
      errors: errors,
      values: req.body
    })
  } else {
    MongoClient.connect(config.db, function(err, db) {
      db.collection('users').updateOne({
        _id: ObjectId(req.session.user._id)
      }, {
        $push: { creditCards: req.body }
      }, function(err, result) {
        if (req.session.user.cards) {
          req.session.user.cards = [];
        }
        req.session.user.creditCards.push(req.body);
        res.redirect(req.session.desiredPage);
      });
    });
  }

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
