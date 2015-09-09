exports.index = function(req, res) {
	var db = req.db;
	var collection = db.get('cadeaux');
	collection.find({}, {}, function(e, docs) {
		res.render('cadeaux', {
			"title": "eChristmas",
			"cadeaux" : docs
		});
	});
};

exports.search = function(req, res) {
	var db = req.db;
	var user = req.param('user');
	var collection = db.get('cadeaux');
	collection.find({owner : {$ne: user}}, {}, function(e, docs) {
		res.render('cadeaux', {
			"title": "eChristmas",
			"cadeaux" : docs
		});
	});
};

exports.new = function(req, res) {
	res.render('cadeau', {
		title : 'eChristmas',
		subtitle: "Ajouter Cadeau",
		
	});
};

exports.view = function(req, res) {
	var role = req.param('role');
	if(role == 'admin') {
		role = 'admin';
	} else {
		role = 'user';
	}
	var cadeauId = req.param('cadeauId');
	var db = req.db;
	console.log("cadeauId:"+cadeauId)
	chargerCadeau(db, cadeauId, function(cadeau) {
		res.render('viewCadeau', {
			title: "eChristmas",
			subtitle: "Afficher Cadeau",
			"cadeau" : cadeau,
			"role" : role
		});
	});
	
	
};

chargerCadeau = function(db, cadeauId, callback) {
	var collection = db.get('cadeaux');
	collection.findOne({_id:cadeauId}, {}, function(e, docs) {
		console.log("CADEAU CHARGE:"+cadeauId)
		callback(docs);
	});
}

exports.recharger = function(req, res) {
	console.log("Recharger:"+cadeauId);
	var cadeauId = req.param('cadeauId');
	var webshot = req.webshot;
	var md5 = req.md5;
	var db = req.db;
	chargerCadeau(db, cadeauId, function(cadeau) {
		var nomImage = md5.update(cadeau.lien).digest("hex");
		console.log("Before Update:"+cadeau.lien+" -->"+nomImage);
		webshot(cadeau.lien, 'webshot/'+nomImage+'.png', function(err) {
			if(err) throw err;
			console.log("Update:"+cadeau.lien+" -->"+nomImage);
			console.log(err);
			// Set our collection
			var collection = db.get('cadeaux');
			collection.update({_id:cadeauId},{$set:  {"image": nomImage}}, function(e, docs) {
				res.location("/cadeau/"+cadeauId);
				res.redirect("/cadeau/"+cadeauId);
			});
		});
		
	});
};


exports.reloadImage = function(req, res) {
	var cadeauId = req.param('cadeauId');
	console.log("reloadImage"+cadeauId);
	var webshot = req.webshot;
	var md5 = req.md5;
	var db = req.db;
	chargerCadeau(db, cadeauId, function(cadeau) {
		console.log("Lien:"+cadeau.lien);
		var nomImage = md5.update(cadeau.lien).digest("hex");
		webshot(cadeau.lien, 'webshot/'+nomImage+'.png', function(err) {
			if(err) throw err;
			console.log(err);
			// Set our collection
			var collection = db.get('cadeaux');
			collection.update({_id:cadeauId},{$set:  {"image": nomImage}}, function(e, docs) {
				res.send(nomImage);
			});
		});
		
	});
};


exports.deleteCadeau = function(req, res) {
	var cadeauId = req.body.cadeauId;
	console.log("Delete:"+cadeauId);
	var db = req.db;
	var collection = db.get('cadeaux');
	
		
		collection.remove({_id: cadeauId}, function(err){
			console.log("Deleted:"+cadeauId);
			res.send("ok");
		});
	
	
};

exports.deleteGetCadeau = function(req, res) {
	var id = req.params.cadeauId;
	console.log("Delete:"+id);
	var db = req.db;
	var collection = db.get('cadeaux');
	
		
		collection.remove({_id: id}, function(err){
			console.log("Deleted:"+id);
		
			res.location("/");
			res.redirect("/");
		});
	
	
};

exports.addCadeau = function(req, res, next) {
	// Set our internal DB variable
	var db = req.db;
	
	var titre = req.body.titre;
	var prenom = req.body.prenom;
	var lien = req.body.lien;
	var user = req.body.user;

	console.log("Add Cadeau:"+titre+prenom+lien);
	// Set our collection
	var collection = db.get('cadeaux');

	// Submit to the DB
	collection
			.insert(
					{
						"titre" : titre,
						"prenom" : prenom,
						"lien" : lien,
						//"image": nomImage,
						"statut": "annuler",
						"owner" : user
					},
					function(err, doc) {
						if (err) {
							// If it failed, return error
							res.send("There was a problem adding the information to the database.");
						} else {
							res.send(doc);
							// If it worked, set the header so the address bar
							// doesn't still say /adduser
							//res.location("/cadeau/"+doc._id);
							// And forward to success page
							//res.redirect("/cadeau/"+doc._id);
						}
					});
};

exports.updateCadeau = function(req, res, next) {
	// Set our internal DB variable
	var db = req.db;
	
	var titre = req.body.titre;
	var lien = req.body.lien;
	var id = req.body.id;

	console.log("Update Cadeau:"+titre+" "+id);
	// Set our collection
	var collection = db.get('cadeaux');

	// Submit to the DB
	cadeauChange(id, req, titre, lien, function(){
		res.send("ok");
	}); 
};

exports.reserver = function(req, res, next) {
	var id = req.params.cadeauId;
	var usr = req.params.usr;
	cadeauChangeStatut(id, req, "reserver", usr, function(){
		res.location("/cadeau/"+id);
		res.redirect("/cadeau/"+id);
	}); 
};

exports.annuler = function(req, res, next) {
	var id = req.params.cadeauId;
	var usr = req.params.usr;
	cadeauChangeStatut(id, req, "annuler", usr, function(){
		res.location("/cadeau/"+id);
		res.redirect("/cadeau/"+id);
	});
};

exports.acheter = function(req, res, next) {
	var id = req.params.cadeauId;
	var usr = req.params.usr;
	cadeauChangeStatut(id, req, "acheter", usr, function(){
		res.location("/cadeau/"+id);
		res.redirect("/cadeau/"+id);
	});
};

cadeauChange = function(id, req, titre, lien, callback) {
	var db = req.db;
	var collection = db.get('cadeaux');
	collection.update({_id:id},{$set:  {"titre": titre, "lien": lien}}, function(e, docs) {
		callback();
	});
};

cadeauChangeStatut = function(id, req, statut, usr, callback) {
	var db = req.db;
	var collection = db.get('cadeaux');
	collection.update({_id:id},{$set:  {"statut": statut, "usrStatut" : usr}}, function(e, docs) {
		callback();
	});
};