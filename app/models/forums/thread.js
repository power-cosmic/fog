var Post = require('./post');

var Thread = function(user, title, content) {
  Post.call(this, user, content);
  this.title = title;
};

Thread.prototype = Object.create(Post.prototype);

module.exports = Thread;
