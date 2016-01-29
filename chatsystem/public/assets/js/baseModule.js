(function(){
	angular.module('App',[])
	.controller('baseController',require('./baseController'))
	.service('socketService',require('./socketService'));
})();