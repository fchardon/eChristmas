
/**
 * Display Account PAge
 */
exports.index = function(req, res) {
	var db = req.db;
	var collection = db.get('accounts');
	collection.find({}, {}, function(e, docs) {
		res.render('accounts', {
			"title": "eChristmas",
			"accounts" : docs
		});
	});
};

/**
 * Save new Account
 */
exports.save = function(req, res) {
	console.log("Init Save Account");
	
	
	var account = 
    {
        "name": req.body.account,
        "user":req.body.user,
        "password":req.body.password,
    };
	console.log("Save new account:"+account.name+";"+account.user);
	
	addAccount(account,req, res, function(err, doc) {
		if (err) {
			console.log("Erreur lors de l ajoute de l utilisateur:"+user);
			res.send("There was a problem adding the information to the database.");
		} else {
			console.log("Account added, redirect to :/lists/"+account.account+"/"+account.user);
			res.send("/lists/"+account.account+"/"+account.user)
			//res.location("/lists/"+account.account+"/"+account.user);
			//res.redirect("/lists/"+account.account+"/"+account.user);
		}
	});
	
};


addAccount = function(account, req, res, callback) {
	var db = req.db;
	var collection = db.get('accounts');
	console.log("Add Account:"+account.name);
	
	// Submit to the DB
	collection.insert(
					{
						"name" : account.name,
						"user" : account.user,
						"password" : account.password
					},
					addUser2(account.name, account.user, req, res, callback)
					);	
	
};

addUser2 = function(account, user, req, res, callback) {
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
						console.log("User added");
						callback(err, doc);
					});	
	
	
};