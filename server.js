var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    bodyParser = require('body-parser'),
    config = require('./config/config'),
    methodOverride = require('method-override'),
    port = 8080;

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(morgan('dev'));

require('./app/routes/common.routes')(app);
require('./app/routes/forum.routes')(app);
require('./app/routes/dev.routes')(app);

app.use(express.static('./public'));

app.use(function(req, res, next) {
  res.status(404);
  res.render('common/pages/404', {url: req.url});
});

app.listen(port);
console.log('listening on port ' + port);
