var register = require('../controllers/register.controller');

module.exports = function(app) {
  app.route('/register/')
    .get(register.begin);
};
