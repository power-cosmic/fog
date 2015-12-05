var Game = function(title, developer, files, description,
    instructions, id) {
  this.title = title;
  this.developer = developer;
  this.files = files;
  this.description = description;
  this.instructions = instructions;
  this.id = id;
};

Game.prototype.fromMongo = function(document) {
  this.title = document.title;
  this.developer = document.developer;
  this.files = document.files;
  this.descripion = document.description;
  this.instructions = document.instructions;
  this.id = document._id;

  return this;
};

module.exports = Game;
