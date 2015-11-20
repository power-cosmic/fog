var Thread = function(user, title, content) {
  this.user = user;
  this.title = title;
  this.content = content;
  this.posts = [];
};

Thread.prototype.addPost = function(post) {
  this.posts.push(post);
};

module.exports = Thread;
