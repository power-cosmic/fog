var register = require('../controllers/register.controller');

module.exports = function(app) {
  app.route('/register/')
    .get(register.begin)
    .post(register.create);

  app.route('/register/auth')
    .post(register.auth);

  app.route('/login')
    .post(register.login);

  app.route('/logout')
    .get(register.logout);

};
