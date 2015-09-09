
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('clients', { title: 'eChristmas' });
};


/*
 * GET List Client.
 */
exports.search = function(req, res){
	var db = req.db;
	 var collection = db.get('usercollection');
	 collection.find({},{},function(e,docs){
		 res.send(docs
	        );
	    });
};



exports.addClient = function(req, res, next) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("client");
            // And forward to success page
            res.redirect("client");
        }
    });
};