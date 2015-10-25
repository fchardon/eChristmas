var services = angular.module('service');

services.factory('localStorage', [ '$window', function($window) {
	var save = function(key, value) {
		console.log(key+" "+value);
		$window.localStorage.setItem(key, value);
	};

	var read = function(key) {
		value = $window.localStorage.getItem(key);
		console.log("Read:"+key+" "+value);
		return value;
		
	};

	return {
		save : save,
		read : read
	};
} ]);


//service.factory('savedUser',[ function(){
//	$http({
//        url: '/savedUser',
//        method: "POST",
//        data: postData,
//        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
//    }).success(function (data, status, headers, config) {
//            $scope.persons = data; // assign  $scope.persons here as promise is resolved here 
//        }).error(function (data, status, headers, config) {
//            $scope.status = status;
//        });
//}]);


//services.factory('de', [ '$q', '$timeout', function($q, $timeout) {
//	var roll = function() {
//		var deferred = $q.defer();
//		
//		$timeout(function() {
//			deferred.notify('Rolling');
//			}, 100);
//		
//		
//		
//		
//		$timeout(function() {
//			var value = Math.floor(Math.random() * 7) + 1;
//			if (value < 7) {
//				deferred.resolve(value);
//			} else {
//				deferred.reject('The dice fell off the table');
//			}
//		}, 3000);
//		return deferred.promise;
//	};
//	return {
//		roll : roll
//	};
//}]);