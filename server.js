var rl = require('readline').createInterface(process.stdin, process.stdout),
    express = require('express'),
    morgan = require('morgan'),
    app = express(),
    bodyParser = require('body-parser'),
    config = require('./config/config'),
    methodOverride = require('method-override'),
    session = require("express-session"),
    User = require('./app/models/users/user'),

    port = config.defaultPort || 8080,
    secretKey = config.cookieKey || 'NOTSOSECRET',
    cookieAge = config.cookieAge || 600000; //default 10 minutes

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

if (config.logging) {
  app.use(morgan('dev'));
}

//setup the session
app.use(session(
  {
    resave: true,
    saveUninitialized: true,
    secret: secretKey,
    cookie: {
      maxAge: cookieAge
    }
  }
));

//make the session available to all ejs templates
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next(null, req, res);
});

require('./app/routes/common.routes')(app);
require('./app/routes/forum.routes')(app);
require('./app/routes/game.routes')(app);
require('./app/routes/register.routes')(app);
require('./app/routes/dev.routes')(app);
require('./app/routes/admin.routes')(app);

app.use(express.static('./public'));

app.use(function(req, res, next) {
  res.status(404);
  res.render('common/pages/404', {url: req.url});
});

app.listen(port);
console.log('listening on port ' + port);

rl.on('line', function(line) {
  if (line.trim().match(/^exit|q(?:uit)?$/i)) {
    process.exit(0);
  }
});
