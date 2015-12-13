var admin = require('../controllers/admin.controller');

module.exports = function(app) {

  app.route('/admin/pending')
    .get(admin.auth, admin.readPending);

  app.route('/admin/new-token')
    .get(admin.auth, admin.newToken)
    .post(admin.auth, admin.sendToken);

  app.route('/admin/register/:id')
    .get(admin.register)
    .post(admin.create);

  app.route('/admin/user-list')
    .get(admin.auth, admin.getUsers)

  app.route('/admin/update-games')
    .get(admin.auth, admin.updateGames);

  app.route('/admin/ban/:userId')
    .post(admin.banUser);

  app.route('/admin/unban/:userId')
    .post(admin.unbanUser);

  app.param('id', admin.getById);
  app.param('userId', admin.setUserId);

};
