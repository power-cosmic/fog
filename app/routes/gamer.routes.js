var gamer = require('../controllers/gamer.controller');

module.exports = function(app) {

    app.route('/gamers/add-card')
      .get(gamer.auth, gamer.addCard)
      .post(gamer.auth, gamer.submitCard);


};
