var path = require('path'),
    User = require('../models/users/user');

module.exports = function(app) {

  var libPath = path.join(__dirname, '../../public/lib/');

  app.get('/', function(req, res) {

    //temporary development
    console.log(req.session.user);
    if(req.session.user === undefined) {
      req.session.user = new User('Cade');
      req.session.user.type = 'guest';
    }

    res.render('common/pages/index');
  });

  app.get('/lib/ajaxer.js', function(req, res) {
    res.sendFile(libPath + 'ajaxer/lib/ajaxer.js');
  });

  app.get('/lib/jqlite.js', function(req, res) {
    res.sendFile(libPath + 'jqlite/lib/jqlite.js');
  });
};
