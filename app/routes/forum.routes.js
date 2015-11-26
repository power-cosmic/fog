module.exports = function(app) {
  app.get('/forums/thread', function(req, res) {
    var user = require('../models/users/user');
    var post = require('../models/forums/post');
    var thread = require('../models/forums/thread');
    res.render('forums/pages/forum-thread', {
      User: user,
      Post: post,
      Thread: thread
    });
  });
};
