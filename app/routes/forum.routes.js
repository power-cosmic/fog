var forums = require('../controllers/forum.controller');

module.exports = function(app) {
  app.route('/forums/thread/:threadId')
    .get(forums.readThread);

  app.param('threadId', forums.threadById);
  app.param('postId', forums.postById);
};
