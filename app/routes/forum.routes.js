var forums = require('../controllers/forum.controller'),
    register = require('../controllers/register.controller');

module.exports = function(app) {

  app.route('/forums/')
    .get(forums.list);

  app.route('/forums/thread/')
    .get(register.requiresNonBannedLogin, forums.new)
    .post(register.requiresNonBannedLogin, forums.create);

  app.route('/forums/thread/:threadId')
    .get(forums.readThread);

  app.route('/forums/posts/')
    .post(register.requiresNonBannedLogin, forums.postReply);

  app.param('threadId', forums.threadById);
};
