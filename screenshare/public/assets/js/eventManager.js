(function(){
	/*Service for handling events in this application*/
 	var eventManager = function($rootScope){
		return {
			addEvent: function(eventName, callback){
				$rootScope.$on(eventName, callback);
			},
			dispatchEvent: function(eventName, data){
				$rootScope.$broadcast(eventName, data);
			}
		};
	}	
	eventManager.$inject = ['$rootScope'];
	module.exports = eventManager;
})();