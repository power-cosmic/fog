var ObjectId = require('mongodb').ObjectID;

var User = function(username, password, salt, firstName, lastName, email,
    phoneNumber, type, id) {
  this.username = username;
  this.password = password;
  this.salt = salt;
  this.firstName = firstName;
  this.lastName = lastName;
  this.email = email;
  this.phoneNumber = phoneNumber;
  this.type = type;
  this._id = id;
};

User.vals = [
  "username", "password", "first name", "last name", "email", "phone number"
];

User.fromMongo = function(document) {
  return new User(document.username, document.password, document.salt, document.firstname,
    document.lastname, document.email, document.phonenumber, document.type,
    document._id);
};

User.toMongo = function() {
  var output = {
    username: this.username,
    password: this.password,
    salt: this.salt,
    firstName: this.firstName,
    email: this.email,
    phoneNumber: this.phoneNumber,
    type: this.type,
    _id: this._id || new ObjectId()
  }
};

module.exports = User;
