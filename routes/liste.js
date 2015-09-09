exports.addList = function(req, res) {
	res.render('addList', {});
};


exports.liste = function(req, res) {
	var user = req.param('user');
	var db = req.db;
	var collection = db.get('personnes'); 
	
	collection.find({"owner":user}, {}, function(e, docs) {
		res.render('addList', {
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
