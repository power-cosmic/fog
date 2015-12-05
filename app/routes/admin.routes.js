var admin = require('../controllers/admin.controller');

module.exports = function(app) {

  app.route('/admin/new-token')
    .get(admin.auth, admin.tokens);

};
