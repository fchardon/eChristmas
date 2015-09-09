#!/bin/env node
//  OpenShift sample Node application
var express = require('express'),
routes = require('./routes'),
cadeau = require('./routes/cadeau'),

liste = require('./routes/liste'),
http = require('http'),
path = require('path'),
//reload = require('reload'),
webshot = require('webshot'),
crypto = require('crypto');
var fs      = require('fs');

//New Code
var mongo = require('mongodb');
var monk = require('monk');
//var db = monk('localhost:27017/echristmas');

//var app = express();

var md5 = crypto.createHash('md5');


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;
        


     // default to a 'localhost' configuration:
     //var connection_string = 'mongodb://127.0.0.1:27017/echristmas';
     //var connection_string = 'admin:AXs6b7EDccpu@$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/echristmas';
     //mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/
     // if OPENSHIFT env variables are present, use the available connection info:
     /*if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
       connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
       process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
       process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
       process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
       process.env.OPENSHIFT_APP_NAME;
     }*/

//      
     //mongodb configuration
     var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
     var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
     var mongoUser = 'admin'; //mongodb username
     var mongoPass = 'AXs6b7EDccpu'; //mongodb password
     var mongoDb   = 'echristmas'; //mongodb database name
     
     //connection strings
     var mongoString = 'mongodb://' + mongoUser + ':' + mongoPass + '@' + mongoHost + ':' + mongoPort + '/' + mongoDb;
     //var mongoString = 'mongodb://127.0.0.1:27017/echristmas';
     
     //connect to mongo
     var mongoClient = monk(mongoString, function(err){
       if (err) console.log(err);
       else console.log("Connection Serveur DB Ok");
     });
//     console.log(mongoString);
     
     self.db = mongoClient;//monk(connection_string);

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        //self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

//        self.routes['/asciimo'] = function(req, res) {
//            var link = "http://i.imgur.com/kmbjB.png";
//            res.send("<html><body><img src='" + link + "'></body></html>");
//        };
//
//        self.routes['/'] = function(req, res) {
//            res.setHeader('Content-Type', 'text/html');
//            res.send(self.cache_get('index.html') );
//        };
//        
//        self.routes['/'], routes.index);
        
       
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
//        self.app = express.createServer();
    	self.app = express();
    	
    	
        self.app.set('views', __dirname + '/views');
        self.app.set('view engine', 'jade');
        self.app.use(express.favicon());
//        app.use(express.logger('dev'));
        self.app.use(express.bodyParser());
        self.app.use(express.methodOverride());
        self.app.use(express.static(path.join(__dirname, 'public')));
        self.app.use('/webshot', express.static(path.join(__dirname, 'webshot')));

        self.app.use(function(req, res, next) {
        	req.db = self.db;
        	req.webshot = webshot;
        	req.md5 = md5;
        	next();
        });
        
        
        //  Add handlers for the app (from the routes).
//        for (var r in self.routes) {
//            self.app.get(r, self.routes[r]);
//        }
        /*
        self.app.get('/', routes.index);
        self.app.post('/save', routes.save);
        self.app.get('/cadeaux', cadeau.index);
        self.app.get('/newCadeau', cadeau.new);
        self.app.post('/addCadeau', cadeau.addCadeau);
        self.app.get('/cadeau/:cadeauId', cadeau.view); 
      self.app.get('/cadeau/:cadeauId/role/:role', cadeau.view); 
      self.app.get('/cadeau/:cadeauId/delete/ok', cadeau.deleteCadeau); 
      self.app.get('/cadeau/reserver/:cadeauId/:usr', cadeau.reserver); 
      self.app.get('/cadeau/annuler/:cadeauId/:usr', cadeau.annuler); 
      self.app.get('/cadeau/:cadeauId/recharger', cadeau.recharger);
      self.app.get('/cadeau/:cadeauId/reloadImage', cadeau.reloadImage);
      */
      self.app.get('/', routes.index);
      self.app.post('/save', routes.save);
      self.app.get('/cadeaux', cadeau.index);
      self.app.get('/cadeaux/:user', cadeau.search);
      self.app.get('/newCadeau', cadeau.new);
      self.app.post('/addCadeau', cadeau.addCadeau);
      self.app.post('/updateCadeau', cadeau.updateCadeau);
      self.app.get('/addList', liste.addList);
      self.app.get('/list/:user', liste.liste);
      self.app.get('/chargeCadeau/:prenom', liste.charger);
      self.app.post('/addPersonne', liste.addPersonne);
      self.app.get('/cadeau/:cadeauId', cadeau.view); 
      self.app.get('/cadeau/:cadeauId/role/:role', cadeau.view); 
      self.app.get('/cadeau/:cadeauId/delete/ok', cadeau.deleteCadeau); 
      self.app.post('/delete/cadeau', cadeau.deleteCadeau); 
      self.app.get('/cadeau/reserver/:cadeauId/:usr', cadeau.reserver); 
      self.app.get('/cadeau/annuler/:cadeauId/:usr', cadeau.annuler); 
      self.app.get('/cadeau/:cadeauId/recharger', cadeau.recharger);
      self.app.get('/cadeau/:cadeauId/reloadImage', cadeau.reloadImage);
      	
        self.app.use(self.app.router);
        
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

