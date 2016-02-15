(function(){
	require('./chatModule');
	require('./screenShareModule');
	angular.module('App',['chatModule', 'screenShareModule'])
	.controller('baseController',require('./baseController'))
	.factory('sharingUser',require('./sharingUserFactory'))
	.service('baseService',require('./baseService'))
	.service('eventManager',require('./eventManager'))
	.service('signallingService',require('./signallingService'));
})();