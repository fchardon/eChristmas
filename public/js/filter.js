var filters = angular.module('filter', []);

filters.filter('moment', function() {
		return function(input, format) {
			format = format || 'll';
			return moment(input).format(format);
	};
});