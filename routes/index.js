/*
 * GET home page.
 */

exports.index = function(req, res) {
		res.render('index', {
			"title": "eChristmas"
		});
};

exports.save = function(req, res) {
	
	var username = req.param('username');
	
	getUser(username, req.db, function(doc) {
		res.send(doc);
	}, function() {
		addUser(username, req, res);
	});
	
};


getUser = function(username, db, userFind, userNotFound) {
	var collection = db.get('users');
	console.log("Get user:"+username);
	
	// Submit to the DB
	collection.findOne({user:username}, {}, function(error, item){
		if(item == null) {
			console.log("item non trouve");
			userNotFound();
		} else {
			console.log("User:"+item._id);
			userFind(item);
		}
	});
};

addUser = function(user, req, res) {
	var db = req.db;
	var collection = db.get('users');
	console.log("Add User:"+user);
	
	// Submit to the DB
	collection.insert(
					{
						"user" : user
					},
					function(err, doc) {
						if (err) {
							console.log("Erreur lors de l ajoute de l utilisateur:"+user);
							res.send("There was a problem adding the information to the database.");
						} else {
							console.log("Utilisateur ajouté:"+user);
							res.send(doc);
						}
					});	
};

