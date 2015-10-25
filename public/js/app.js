var controllers = angular.module('controller', []);
var filters = angular.module('filter', []);
var services = angular.module('service', []);

angular.module('app', ['controller', 'filter', 'service', 'ngCookies', 'ui.bootstrap']);