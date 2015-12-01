var dev = require('../controllers/dev.controller');

module.exports = function(app) {

  app.route('/dev/newGame')
    .get(dev.newGame);

};
