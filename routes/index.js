/*
 * GET home page.
 */
exports.index = function(req, res) {
		res.render('index', {
			"title": "eChristmas"
		});
};

/*
 * Create a new Whish List
 */
exports.create = function(req, res) {
		res.render('create', {
			"title": "eChristmas"
		});
};

/**
 * Connect a user.
 * Generate a sessionId
 */
exports.connectUser = function(req, res) {
	var username = req.body.user;
	console.log("ConnectUser:"+username);
	
	getUser(username, req.db, function(doc) {
		doc["sessionId"] = generate_key(req);
		res.send(doc);
	});
};

exports.users = function(req, res) {
	var username = req.param('user');
	console.log("Read:"+username);
	
	getUser(username, req.db, function(doc) {
		res.send(doc);
	});
};

exports.save = function(req, res) {
	
	var username = req.param('user');
	var account = req.param('account');
	console.log("Save:"+username);
	
	
	getUser(username, req.db, function(doc) {
		res.send(doc);
	}, function() {
		addUser(account, username, req, res);
	});
	
};


exports.deleteUser = function(req, res) {
	
	var personneId = req.body.personneId;
	console.log("Delete:"+personneId);
	var db = req.db;
	var collection = db.get('users');
	
		
		collection.remove({_id: personneId}, function(err){
			console.log("Deleted:"+personneId);
			res.send("ok");
		});
	
};

var generate_key = function(req) {
    //var sha = crypto.createHash('sha256');
	var sha = req.md5;
	sha.update(Math.random().toString());
    return sha.digest('hex');
};

getUser = function(username, db, userFind, userNotFound) {
	var collection = db.get('users');
	console.log("Get user:"+username);
	if(username == 'undefined') {
		console.log("getUser username is undefined !!!");
		
	} else {
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
	}
};

addUser = function(account, user, req, res) {
	var db = req.db;
	var collection = db.get('users');
	console.log("Add User:"+user);
	
	// Submit to the DB
	collection.insert(
					{
						"user" : user,
						"account" : account,
						"isAdmin" : false
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

