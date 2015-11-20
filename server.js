var express = require('express');
var morgan = require('morgan');
var app = express();
var port = 8080;

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/forums/thread', function(req, res) {
  var user = require('./app/models/users/user');
  var post = require('./app/models/forums/post');
  var thread = require('./app/models/forums/thread');
  res.render('pages/forum-thread', {
    User: user,
    Post: post,
    Thread: thread
  });
});

app.use(morgan('dev'));
app.use(express.static('./public'));

app.use(function(req, res, next) {
  res.status(404);
  res.render('pages/404', {url: req.url});
});

app.listen(port);
console.log('listening on port ' + port);
