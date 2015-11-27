var ObjectId = require('mongodb').ObjectID;

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

Post.prototype.fromMongo = function(document) {
  this.user = document.user;
  this.content = document.content;
  this.id = document._id;

  if (document.replies) {
    var that = this;
    document.replies.forEach(function(subDocument) {
      that.addReply(new Post().fromMongo(subDocument));
    });
  }
  return this;
};

Post.prototype.toMongo = function() {
  var output = {
    user: this.user,
    content: this.content,
    _id: this.id || new ObjectId(),
    replies: []
  }
  this.replies.forEach(function(reply) {
    output.replies.push(reply.toMongo());
  });
  return output;
};

Post.prototype.getPost = function(id) {
  if (this.id == id) {
    return this;
  } else {
    for (var i = 0; i < this.replies.length; i++) {
      var reply = this.replies[i].getPost(id);
      if (reply) {
        return reply;
      }
    }
  }
  return null;
};

module.exports = Post;
