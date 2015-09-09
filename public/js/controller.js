var controllers = angular.module('controller');

controllers.controller('connectedCtrl', function($scope, $cookies, $location, $cookieStore) {
	$scope.userName = $cookies.userName;
		
	$scope.getActiveClass = function (className) {
		if(window.location.pathname == className) {
			return "active";
		} else {
			return "";
		}
		
	};
	
	$scope.deconnecter = function() {
		$cookieStore.put("toto",1);
		alert("ici");
		$cookieStore.remove("userName");
		
		//window.location = "/";
	}
});


	
controllers.controller('indexCtrl', function($scope, localStorage, $cookies, $http) {
	$scope.userName = $cookies.userName;
	var usr = $cookies.userName;
	console.log(usr);
	
	if(usr) {
		$scope.usr = usr;
		window.location = "/cadeaux/"+usr;
		
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
//		$q.all([de.roll(), de.roll()])
//		 .then(function(values){
//			$scope.value = values[0] + values[1];
//		});
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



