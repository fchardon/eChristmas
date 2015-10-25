/**
 * Module dependencies.
 */

var express = require('express'),
routes = require('./routes'),
cadeau = require('./routes/cadeau'),
accounts = require('./routes/accounts'),
liste = require('./routes/liste'),

http = require('http'),
path = require('path'),
webshot = require('webshot'),
crypto = require('crypto');


// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/echristmas');

var app = express();

var md5 = crypto.createHash('md5');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/webshot', express.static(path.join(__dirname, 'webshot')));

//Make our db accessible to our router
app.use(function(req, res, next) {
	req.db = db;
	req.webshot = webshot;
	req.md5 = md5;
	next();
});

app.use(app.router);
app.configure('development', function() {
	app.locals.pretty = true;
});
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}



// Route

// Home
app.get('/', routes.index);

app.get('/create', routes.create);


// Account
app.get('/accounts', accounts.index);
app.post('/accounts/save', accounts.save);

// User
app.post('/save', routes.save);
app.post('/user/delete', routes.deleteUser);
app.get('/users/:user', routes.users);
app.post('/users/connexion', routes.connectUser);


app.get('/cadeaux', cadeau.index);
app.get('/cadeaux/:user', cadeau.search);
app.get('/cadeaux/:account/:user', cadeau.search);
app.get('/newCadeau', cadeau.new);
app.post('/addCadeau', cadeau.addCadeau);
app.post('/updateCadeau', cadeau.updateCadeau);
app.get('/addList', liste.addList);

app.get('/lists/:account/:user', liste.liste);
app.get('/accounts/:account', liste.index);
app.get('/list/:user', liste.liste);
app.get('/chargeCadeau/:prenom', liste.charger);
app.post('/addPersonne', liste.addPersonne);
app.get('/cadeau/:cadeauId', cadeau.view); 
app.get('/cadeau/:cadeauId/role/:role', cadeau.view); 
app.get('/cadeau/:cadeauId/delete/ok', cadeau.deleteGetCadeau);
app.post('/delete/cadeau', cadeau.deleteCadeau); 
app.get('/cadeau/reserver/:cadeauId/:usr', cadeau.reserver); 
app.get('/cadeau/annuler/:cadeauId/:usr', cadeau.annuler); 
app.get('/cadeau/:cadeauId/recharger', cadeau.recharger);
app.get('/cadeau/:cadeauId/reloadImage', cadeau.reloadImage);

var server = http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

//reload(server, app);

server.listen(app.get('port'), function() {
	console.log("Web server listening on port " + app.get('port'));
});