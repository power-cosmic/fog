var Post = function(user, content) {
  this.user = user;
  this.content = content;
  this.replies = [];
};

Post.prototype.addReply = function(reply) {
  this.replies.push(reply);
};

module.exports = Post;
