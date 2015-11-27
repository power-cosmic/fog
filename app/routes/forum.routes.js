var forums = require('../controllers/forum.controller');

module.exports = function(app) {

  app.route('/forums/')
    .get(forums.list);

  app.route('/forums/thread/')
    .get(forums.create);

  app.route('/forums/thread/:threadId')
    .get(forums.readThread);

  app.route('/forums/posts/')
    .post(forums.postReply);

  app.param('threadId', forums.threadById);
};
