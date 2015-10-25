var controllers = angular.module('controller');

controllers.controller('indexCtrl', function ($scope, $http, $cookies, $rootScope) {
	$scope.connexion = false;
	
	$scope.toggled = function() {
		    console.log('Connexion is now: ',  $scope.connexion);
		    $scope.connexion = !$scope.connexion;
	};
	
	$scope.connexion = function() {
		console.log('Connexion for user: ',  $scope.userName);
	    
		$http.post('/users/connexion', { 
			user: $scope.userName,
			pwd: $scope.password})
		.success(function (data, status, headers, config) {
				//$rootScope.session = data.sessionId;
	    		$cookies.userName = data.user;
	    		$cookies.session = data.sessionId;
	    		window.location = "/lists/"+data.account+"/"+data.user;
	        })
	    .error(function (data, status, headers, config) {
	            $scope.status = status;
	        });
	}
});

controllers.controller('dropdownCtrl', function ($scope) {
	$scope.test = "a";
	
	$scope.items = [
	    'The first choice!',
	    'And another choice for you.',
	    'but wait! A third!'
	  ];
	/*
	  alert(items.length);

	  $scope.status = {
	    isopen: false
	  };

	  $scope.toggled = function(open) {
	    console.log('Dropdown is now: ', open);
	  };

	  $scope.toggleDropdown = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
	    $scope.status.isopen = !$scope.status.isopen;
	  };*/
	});

controllers.controller('connectedCtrl', function($scope, $cookies, $location, $http) {
	$scope.userName = $cookies.userName;
	$scope.test = "a";
		
	$scope.getActiveClass = function (className) {
		if(window.location.pathname == className) {
			return "active";
		} else {
			return "";
		}
		
	};
	
	$scope.load = function(user) {
	//	alert("load:"+user.user);
	}
	
	$scope.deconnecter = function() {
		//$cookieStore.put("toto",1);
		//alert("ici");
		$cookies.userName = null;
		$cookies.session = null;
		
		window.location = "/";
	}
	

});


	
controllers.controller('createAccountCtrl', function($scope, $cookieStore, $http, $cookies) {
	$cookieStore.remove("userName");
	console.log("init createAccountCtrl");
		
	
	
	$scope.save = function() {
		var user = 
	      {
	          "account": $scope.accountName,
	          "user":$scope.userName,
	          "password":$scope.accountPassword,
	      };
		console.log("save account:"+user.account+";"+user.user);
		
		savedAccount(user, $http, $cookies);
	};
	
});




controllers.controller('createCtrl', function($scope, localStorage, $cookies, $http) {
	$scope.userName = $cookies.userName;
	var usr = $cookies.userName;
	console.log(usr);
	
	if(usr) {
		$scope.usr = usr;
		window.location = "/lists/chardon/"+usr;
		
	} else {
		$scope.usr = null;
	}
	
	$scope.save = function() {
		savedUser($scope.userName, $http, $cookies);
	};
	
	$scope.usrExist = function() {
		var usr = $cookies.userName;
		if(usr) {
			$scope.usr = usr;
			return true;
		} else {
			return false;
		}
	};
	
	
	
});

controllers.controller('testCtrl', function($scope, $location, $cookies) {
	$scope.age = moment("19790415", "YYYYMMDD").fromNow();
	$scope.loc = $cookies['City'];
});

controllers.controller('cookieCtrl', function($scope, $cookies) {
	$scope.cookieValue = $cookies['City'];
});

controllers.controller('UserCtrl', function UserCtrl($scope, localStorage,
		square, de) {
	$scope.name = localStorage.read('user');
	$scope.save = function() {
		localStorage.save('user', $scope.user);
		localStorage.save('isAdmin', $scope.user);
	};
	$scope.click = function() {
		localStorage.save('user', $scope.user);
	};
	$scope.click2 = function() {
		$scope.name = localStorage.read('user');

	};

	$scope.de = function() {
		de.roll().then(function(value) {
			$scope.value = value;
			return "You're a good dice roller";
		}, function(message) {
			$scope.value = undefined;
			$scope.error = message;
		}).then(function(successMessage) {
			$scope.success = successMessage;
		});
	};

});

controllers.controller('RollCtrl', function UserCtrl($scope, de, $q) {
	
	$scope.lancer = function() {
		
		$scope.value = "";
		de.roll().then(function(value) {
			$scope.value = value;
		}, function(message) {
			$scope.value = message;
		}, function(notification) {
			$scope.value = $scope.value  + notification;
		});
	};

});

function savedUser(user,$http, $cookies) {
	$http.post('/save', { username: user })
	.success(function (data, status, headers, config) {
    		$cookies.userName = data.user;
    		window.location = "/cadeaux/"+userName;
        })
    .error(function (data, status, headers, config) {
            $scope.status = status;
        });
}

function savedAccount(user,$http, $cookies) {
	console.log("savedAccount:"+user.account+";"+user.user);
	
	$http.post('/accounts/save', user)
	.success(function (data, status, headers, config) {
			//alert("account saved"+data);
    		//$cookies.userName = data.user;
    		window.location = data;
        })
    .error(function (data, status, headers, config) {
            $scope.status = status;
            alert("Account saved Failed !")
        });
}


