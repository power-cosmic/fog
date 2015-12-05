var admin = require('../controllers/admin.controller');

module.exports = function(app) {

  app.route('/admin/new-token')
    .get(admin.auth, admin.newToken);

  app.route('/admin/send-token')
    .post(admin.auth, admin.sendToken);

};
