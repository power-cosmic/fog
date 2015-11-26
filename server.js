var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    config = require('./config/config')
    port = 8080;

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

require('./app/routes/forum.routes')(app);



app.use(morgan('dev'));
app.use(express.static('./public'));

app.use(function(req, res, next) {
  res.status(404);
  res.render('pages/404', {url: req.url});
});

app.listen(port);
console.log('listening on port ' + port);
