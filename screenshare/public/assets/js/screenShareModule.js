(function(){
	angular.module('screenShareModule',[])
	.controller('screenShareController',require('./screenShareController'))
	.service('screenShareService',require('./screenShareService'))
	.directive('screenShareVideoDir',require('./screenShareVideoDir'));
})();