var Post = require('./post');

var Thread = function(user, title, content, id) {
  Post.call(this, user, content, id);
  this.title = title;
};

Thread.prototype = Object.create(Post.prototype);

Thread.prototype.fromMongo = function(document) {
  Post.prototype.fromMongo.call(this, document);
  this.title = document.title;
  return this;
};

Thread.prototype.toMongo = function() {
  var output = Post.prototype.toMongo.call(this);
  output.title = this.title;
  return output;
};

module.exports = Thread;
