var controllers = angular.module('controller');



controllers.controller('cadeauCtrl', function($scope, $http, $cookies) {

	$scope.submitTheForm = function(item, event) {
	       console.log("--> Submitting form:"+$scope.titre);
	       var dataObject = {
	          titre : $scope.titre
	          ,prenom  : $scope.prenom
	          ,lien : $scope.lien
	       };

	       var responsePromise = $http.post("/addCadeau", dataObject, {});
	       responsePromise.success(function(dataFromServer, status, headers, config) {
	          window.location =  "cadeau/"+dataFromServer._id;
	       });
	        responsePromise.error(function(data, status, headers, config) {
	          alert("Erreur lors de l'ajout d'un nouveau cadeau");
	       });
	     }
  
});

controllers.controller('tableCadeauCtrl', function($scope/*, $http, $cookies*/) {

	$scope.init = function(cadeau) {
		$scope.cadeau = cadeau;
		
		if(cadeau.statut == "reserver") {
			$scope.label = "warning";
		}else if(cadeau.statut == "acheter") {
			$scope.label = "success";
		} else {
			$scope.label = "annuler";
				
		}
	};
	
	$scope.reserver = function(cadeau) {
		if(cadeau.statut != 'reserver') {
			return true;
		} else {
			return false;
		}
	};
	
	$scope.annuler = function(cadeau) {
		if(cadeau.statut != 'annuler') {
			return true;
		} else {
			return false;
		}
	};
	

});

controllers.controller('cadeauxCtrl', function($scope, localStorage, $cookies) {
	$scope.usr = $cookies.userName;
	if($scope.usr == null) {
		window.location = "/";
	}
	$scope.userName = localStorage.read("userName");
	
	$scope.loadImage = function(cadeau) {
		if(cadeau.image == null) {
			$scope.webshotClass="in-action";
			return "/image/in-action.png";
		} else {
			$scope.webshotClass="webshot";
			return "/webshot/"+cadeau.image+".png";
		}
	}
});

controllers.controller('viewCadeauCtrl', function($scope, $cookies, $http, $q) {
	$scope.userName = $cookies.userName;
	
	$scope.init = function(cadeau) {
		$scope.cadeau = cadeau;
		
		if($scope.cadeau.statut == "reserver") {
			$scope.label = "warning";
			$scope.statutMessage = cadeau.statut+" par "+cadeau.usrStatut;
		} else {
			$scope.label = "success";
			$scope.statutMessage = "Disponible";
		}
		
		checkLoadImage(cadeau, $scope, $http, $q);
		/*if(cadeau.image == null) {
			$scope.webshotClass="loader";
			$scope.imgSrc = "/image/loader.gif";
			//a mettre ds service
			$http.get("/cadeau/"+cadeau._id+"/reloadImage")
			.then(function(data){
				$scope.webshotClass="webshot-grand";
				$scope.imgSrc = "/webshot/"+data.data+".png";
			});
		} else {
			$scope.webshotClass="webshot-grand";
			$scope.imgSrc = "/webshot/"+cadeau.image+".png";
		}*/
	};
	
	console.log("viewCadeauCtrl");
	
	
	$scope.estRole = function(role) {
		if(role == 'user') {
			$scope.estRole = false;
		} else {
			$scope.estRole = true;
		}
	}
	
	
	
	$scope.estAReserver = function(cadeau) {
		if(cadeau.statut != "reserver") {
			return true;
		} else {
			return false;
		}
	};
	
	$scope.estAAnnuler = function(cadeau) {
		if(cadeau.statut != "annuler") {
			return true;
		} else {
			return false;
		}
	};
	
//	$scope.estAAcheter = function(cadeau) {
//		if(cadeau.statut != "acheter") {
//			return true;
//		} else {
//			return false;
//		}
//	};
	
});

function isImage(src, $q) {

    var deferred = $q.defer();

    var image = new Image();
    image.onerror = function() {
        deferred.resolve(false);
    };
    image.onload = function() {
        deferred.resolve(true);
    };
    image.src = src;

    return deferred.promise;
}

function checkLoadImage(cadeau, $scope, $http, $q) {
	
	if(cadeau.image == null) {
		$scope.webshotClass="loader";
		$scope.imgSrc = "/image/loader.gif";
		//a mettre ds service
		$http.get("/cadeau/"+cadeau._id+"/reloadImage")
		.then(function(data){
			$scope.webshotClass="webshot-grand";
			$scope.imgSrc = "/webshot/"+data.data+".png";
		});
	} else {
		isImage("/webshot/"+cadeau.image+".png", $q).then(function(test) {
			if(test) {
				$scope.webshotClass="webshot-grand";
				$scope.imgSrc = "/webshot/"+cadeau.image+".png";
				
			} else {
				$scope.webshotClass="loader";
				$scope.imgSrc = "/image/loader.gif";
				$http.get("/cadeau/"+cadeau._id+"/reloadImage")
				.then(function(data){
					$scope.webshotClass="webshot-grand";
					$scope.imgSrc = "/webshot/"+data.data+".png";
				});
			}
 		});
	}
}
