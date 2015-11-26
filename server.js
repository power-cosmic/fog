var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    config = require('./config/config')
    port = 8080;

app.set('views', './app/views');
app.set('view engine', 'ejs');

require('./app/routes/common.routes')(app);
require('./app/routes/forum.routes')(app);

app.use(morgan('dev'));
app.use(express.static('./public'));

app.use(function(req, res, next) {
  res.status(404);
  res.render('common/pages/404', {url: req.url});
});

app.listen(port);
console.log('listening on port ' + port);
