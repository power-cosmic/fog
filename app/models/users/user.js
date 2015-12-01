var User = function(username) {
  this.username = username;
};

User.prototype.vals = [
  "username", "password", "first name", "last name", "email", "phone number"
];

User.fromMongo = function(document) {
  return new User(document.username);
};

module.exports = User;
