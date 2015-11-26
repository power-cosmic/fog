var Thread = require('../models/forums/thread'),
    Post = require('../models/forums/post');

exports.readThread = function(req, res) {


  res.render('forums/pages/forum-thread', {
    thread: req.thread
  });
};

exports.postById = function(req, res, next, id) {
  console.log('post id: ' + id);
  next();
};

exports.threadById = function(req, res, next, id) {
  console.log('thread id: ' + id);

  var User = require('../models/users/user'),
      Post = require('../models/forums/post'),
      Thread = require('../models/forums/thread');

  var tyler = new User('thoffma7');
  var thread = new Thread(tyler, 'hello world', 'hey folks');
  var firstPost = new Post(tyler, 'oh, hi');
  thread.addReply(firstPost);
  var reply = new Post(tyler, 'hello to you too');
  firstPost.addReply(reply);
  reply.addReply(new Post(tyler, 'nested hi'));
  reply.replies[0].addReply(new Post(tyler, 'this is soo nested'));
  reply.addReply(new Post(tyler, 'another nested hi'));
  thread.addReply(new Post(tyler, 'hello!!!!!!!!'));

  req.thread = thread;

  next();
};
