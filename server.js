var express = require('express');
var morgan = require('morgan');
var app = express();
var port = 8080;

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index.ejs');
});

app.use(morgan('dev'));
app.use(express.static('./public'));

app.listen(port);
console.log('listening on port ' + port);
