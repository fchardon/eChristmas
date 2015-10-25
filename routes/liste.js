exports.addList = function(req, res) {
	res.render('addList', {});
};


exports.liste = function(req, res) {
	var userName = req.param('user');
	var account = req.param('account');
	var db = req.db;
	var collection = db.get('personnes'); 
	
	// Load User
	getUser(userName, req.db, function(user) {
		//defer.resolve(doc);
		console.log("liste:"+userName)
		// Then load personne
		collection.find({"owner":userName}, {}, function(e, docs) {
			res.render('addList', {
				"personnes" : docs,
				"account" : account,
				"user" : user
			});
		});
	});
	
	
	
};

/**
 * Allow to add a new user to a list.
 * TOTO: Move to account.js
 */
exports.index = function(req, res) {
	var account = req.param('account');
	var db = req.db;
	var collection = db.get('users'); 
	
	
	
	collection.find({"account":account}, {}, function(e, docs) {
		res.render('accountsList', {
			"account" : account,
			"personnes" : docs
		});
	});
	
	
};

exports.charger = function(req, res) {
	var prenom = req.param('prenom');
	var db = req.db;
	var collection = db.get('cadeaux'); 
	
	collection.find({"prenom":prenom}, {}, function(e, docs) {
		res.send({
			"cadeaux" : docs
		});
	});
};

exports.addPersonne = function(req, res) {
	console.log("addPersonne");
	var db = req.db;
	var collection = db.get('personnes'); 
	
	var prenom = req.body.prenom;
	var user = req.body.user;

	collection
		.insert(
			{
				"prenom" : prenom,
				"owner" : user
			},
			function(err, doc) {
				if (err) {
					res.send("There was a problem adding the information to the database.");
				} else {
					res.send(doc);
				}
			});
};
