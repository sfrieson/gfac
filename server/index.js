var express =  require('express');
var bodyParser = require('body-parser');

var app = express();
import sequelize from './db/sequelize';


app.set('views', './server/views');
app.set('view engine', 'ejs');

app.use(express.static('./build/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.render('login');
});
app.post('/login', function (req, res) {
  // TODO Authenticate User
  console.log(`Attempting Login
  Email:    ${req.body.email}
  Password: ${req.body.password}`);
  res.redirect('/app');
});

app.get('/app', function (req, res) {
  sequelize.authenticate()
  .then(err => res.render('index'))
  .catch(err => res.send(err));
});

app.listen(3000, function () {
  console.log('Listening on 3000');
});