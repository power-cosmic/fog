var User = function(username) {
  this.username = username;
};

User.fromMongo = function(document) {
  return new User(document.username);
};

module.exports = User;
