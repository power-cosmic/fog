var admin = require('../controllers/admin.controller');

module.exports = function(app) {


  app.route('/admin/pending')
    .get(admin.auth, admin.readPending);

  app.route('/admin/new-token')
    .get(admin.auth, admin.newToken);

  app.route('/admin/send-token')
    .post(admin.auth, admin.sendToken);

  app.route('/admin/register/:id')
    .get(admin.register)
    .post(admin.create);

  app.param('id', admin.getById);

};
