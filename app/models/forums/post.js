var Post = function(user, content, id) {
  this.user = user;
  this.content = content;
  this.id = id;
  this.replies = [];
};

Post.prototype.addReply = function(reply) {
  this.replies.push(reply);
};

Post.prototype.hasReplies = function() {
  return this.replies.length > 0;
};

module.exports = Post;
