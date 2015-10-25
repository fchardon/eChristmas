var controllers = angular.module('controller');

// TOTO: Move to account ctrl
controllers.controller('userListCtrl', function($scope, $http, $cookies) {
	console.log("Init userListCtrl");
	$scope.save = function() {
		savedUser($scope.account, $scope.newName, $http, $cookies);
	}

	$scope.deletePersonne = function(user) {
		var dataObject = {
			personneId : user._id
		}
		var responsePromise = $http.post("/user/delete", dataObject, {});

		responsePromise.success(function(dataFromServer, status, headers,
				config) {
			$scope.personnes.splice($scope.personnes.indexOf(user), 1);
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Erreur lors de la suppression d'une personne");
		});
	};
});

controllers.controller('listCtrl', function($scope, $rootScope, $http, $location, $cookies) {
	
			$scope.action = false;
			$scope.count = 0;
			$scope.afficherPrenom = false;
			$scope.afficherTitreCadeau = false;
			$scope.afficherFormTitre = false;
			$scope.titreCadeau = "";
			$scope.message = "";
			$scope.displayCadeaux = false;
			$scope.cadeaux = [];
			//console.log("Session:"+$rootScope.session);
			$scope.load = function(user) {
				//alert("ici")
				//if (!$cookies.userName) {
					// alert("1user"+$cookies.userName);
					//$cookies.userName = user.user;
				//} else {
					// alert("2user"+$cookies.userName);
					// $cookies.userName = user;
				//}

			}

			$scope.init = function(cadeaux) {
				angular.forEach($scope.cadeaux, function(cadeau) {
					console.log(cadeau.titre);
					cadeau.done = true;
					cadeau.newc = false;
				});
			}
			// Test
			// $scope.afficherPrenom = true;
			// $scope.prenomTermine = "Florent";
			// $scope.afficherFormTitre = true;

			$scope.addCadeau = function() {
				$scope.action = true;
			}

			$scope.validerCadeau = function(cadeau, username) {
				if (cadeau.titre != '') {
					cadeau.done = true;
					if (cadeau.newc) {
						creerNouveauCadeau($scope.prenomTermine, cadeau,
								username, $http);
					} else {
						updateCadeau(cadeau, $http);
					}
				} else {
					canAddCadeau = false;
				}
			}

			$scope.editCadeau = function(cadeau) {
				closeOtherCadeau($scope);
				$scope.oldTitre = cadeau.titre;
				cadeau.done = false;

			}

			$scope.cancelCadeau = function(cadeau) {
				console.log(cadeau.titre + " " + cadeau.newc + " "
						+ $scope.oldTitre);
				if (cadeau.newc) {
					$scope.cadeaux.splice($scope.cadeaux.indexOf(cadeau), 1);
				} else {
					cadeau.titre = $scope.oldTitre;
					cadeau.done = true;
				}
			}

			$scope.deleteCadeau = function(cadeau) {
				var dataObject = {
					cadeauId : cadeau._id
				}
				var responsePromise = $http.post("/delete/cadeau", dataObject,
						{});
				responsePromise.success(function(dataFromServer, status,
						headers, config) {
					$scope.cadeaux.splice($scope.cadeaux.indexOf(cadeau), 1);
				});
				responsePromise.error(function(data, status, headers, config) {
					alert("Erreur lors de l'ajout d'un nouveau cadeau");
				});
			};

			$scope.addCadeau = function(username) {
				var canAddCadeau = true;
				angular.forEach($scope.cadeaux, function(cadeau) {
					if (cadeau.titre != '') {
						cadeau.done = true;
						if (cadeau.newc) {
							creerNouveauCadeau($scope.prenomTermine, cadeau,
									username, $http);
						} else {
							updateCadeau(cadeau, $http);
						}
					} else {
						canAddCadeau = false;
					}

				});
				if (canAddCadeau) {
					$scope.cadeaux.push({
						titre : '',
						done : false,
						newc : true
					});
				}
			};

			$scope.addTitreCadeau = function(item) {
				alert("add titre" + item);
			}

			$scope.initPrenom = function() {
				if (!$scope.afficherPrenom) {
					$scope.prenomTermine = $scope.prenom;
					$scope.afficherPrenom = true;
				}
			}

			$scope.editPrenom = function() {
				$scope.afficherPrenom = !$scope.afficherPrenom;
			}

			$scope.addTitrePanel = function() {
				/*
				 * if($scope.signUpForm.titre.$dirty) { $scope.titreCadeau =
				 * $scope.titre; $scope.afficherTitreCadeau = true; } else {
				 * $scope.message = "Veuillez saisir un titre !"; }
				 */

			}

			$scope.nombrecadeau = function() {
				var count = 0;
				angular.forEach($scope.cadeaux, function(cadeau) {
					count += cadeau.done ? 1 : 0;
				});
				return count;
			};

			$scope.afficherCadeau = function(prenom) {
				$scope.displayCadeaux = true;
				$scope.prenomTermine = prenom;
				$scope.afficherPrenom = true;
				$http.get("/chargeCadeau/" + prenom).then(function(data) {
					$scope.cadeaux = data.data.cadeaux;
					// alert("chargé");
					angular.forEach($scope.cadeaux, function(cadeau) {
						console.log(cadeau.titre);
						cadeau.done = true;
						cadeau.newc = false;
					});
				});
			}

});

controllers.controller('personneCtrl', function($scope, $http) {

	$scope.personnes = [ {
		prenom : '',
		done : true,
		newc : true,
		id : ""
	} ];

	$scope.init = function(personnes) {
		angular.forEach($scope.personnes, function(personne) {
			//console.log(personne.prenom);
			personne.done = true;
		});
	}

	$scope.addPersonne = function() {
		$scope.personnes.push({
			prenom : '',
			done : false,
			newc : true
		});
	};

	$scope.validerPersonne = function(personne, username) {
		console.log("Ajouter PErsonne:" + personne.prenom);
		if (personne.prenom != '') {
			ajouterPersonne(username, personne, $http);
		} else {
			alert("Veuillez saisir un prenom !");
		}
		//
	};

	$scope.annulerPersonne = function(personne) {
		console.log("Annuler Personne:" + personne.prenom);
		$scope.personnes.splice($scope.personnes.indexOf(personne), 1);
		//

	};
});

function ajouterPersonne(user, personne, $http) {
	console.log("Ajouter Personne " + personne.prenom + " a " + user);
	var dataObject = {
		prenom : personne.prenom,
		user : user
	};

	var responsePromise = $http.post("/addPersonne", dataObject, {});
	responsePromise.success(function(dataFromServer, status, headers, config) {
		console.log("Personne ajoute" + dataFromServer._id);
		personne._id = dataFromServer._id;
		personne.done = true;
	});
	responsePromise.error(function(data, status, headers, config) {
		alert("Erreur lors de l'ajout d'un nouveau cadeau");
	});
}

function creerNouveauCadeau(prenom, cadeau, user, $http) {
	console.log("Ajouter Cadeau " + cadeau.titre + " a " + prenom + " lien:"
			+ cadeau.lien);
	var dataObject = {
		titre : cadeau.titre,
		prenom : prenom,
		lien : cadeau.lien,
		user : user
	};

	var responsePromise = $http.post("/addCadeau", dataObject, {});
	responsePromise.success(function(dataFromServer, status, headers, config) {
		cadeau.newc = false;
		// window.location = "cadeau/"+dataFromServer._id;
		console.log("cadeau ajouté");
		cadeau._id = dataFromServer._id;
	});
	responsePromise.error(function(data, status, headers, config) {
		alert("Erreur lors de l'ajout d'un nouveau cadeau");
	});
}

function updateCadeau(cadeau, $http) {
	console.log("Update Cadeau " + cadeau.titre);
	var dataObject = {
		titre : cadeau.titre,
		lien : cadeau.lien,
		id : cadeau._id
	};

	var responsePromise = $http.post("/updateCadeau", dataObject, {});
	responsePromise.success(function(dataFromServer, status, headers, config) {
		console.log("Cadeau mise a jour");
	});
	responsePromise.error(function(data, status, headers, config) {
		alert("Erreur lors de l'ajout d'un nouveau cadeau");
	});
}

function closeOtherCadeau($scope) {
	angular.forEach($scope.cadeaux, function(cadeau) {
		console.log(cadeau.titre);
		if (cadeau.titre == '') {
			$scope.cadeaux.splice($scope.cadeaux.indexOf(cadeau), 1);
		} else if (!cadeau.done) {
			cadeau.titre = $scope.oldTitre;
			cadeau.done = true;
		}
	});
}

function savedUser(account, user, $http, $cookies) {
	$http.post('/save', {
		user : user,
		account : account
	}).success(function(data, status, headers, config) {
		// $cookies.userName = data.user;
		window.location = "/accounts/chardon";
	}).error(function(data, status, headers, config) {
		$scope.status = status;
	});
}