var Post = require('./post');

var Thread = function(user, title, content, id) {
  Post.call(this, user, content, id);
  this.title = title;
};

Thread.prototype = Object.create(Post.prototype);

module.exports = Thread;
