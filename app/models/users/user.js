var ObjectId = require('mongodb').ObjectID;

var User = function(userName, password, firstName, lastName, email,
    phoneNumber, type, id) {
  this.userName = userName;
  this.password = password;
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
  return new User(document.username, document.password, document.firstname,
    document.lastname, document.email, document.phonenumber, document.type,
    document._id);
};

User.toMongo = function() {
  var output = {
    username: this.userName,
    password: this.password,
    firstname: this.firstName,
    email: this.email,
    phonenumber: this.phoneNumber,
    type: this.type,
    _id: this._id || new ObjectId()
  }
};

module.exports = User;
