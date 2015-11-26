var Thread = require('../models/forums/thread'),
    Post = require('../models/forums/post');

exports.readThread = function(req, res) {
  var user = require('../models/users/user'),
      post = require('../models/forums/post'),
      thread = require('../models/forums/thread');
      
  res.render('forums/pages/forum-thread', {
    User: user,
    Post: post,
    Thread: thread
  });
};

exports.postById = function(req, res, next, id) {
  console.log('post id: ' + id);
  next();
};

exports.threadById = function(req, res, next, id) {
  console.log('thread id: ' + id);
  next();
};
