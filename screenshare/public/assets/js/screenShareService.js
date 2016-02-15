(function(electronModules){
	var desktopCapturer = electronModules.electron.desktopCapturer;
 	var screenShareService = function($q){
 		var defer = $q.defer();
		return {
			getSources: function(){
				desktopCapturer.getSources({types: ['window']}, function(error, sources) {
				    if (error){
				    	defer.resolve([]);			    					    	
				    }
				    else{
				    	defer.resolve(sources);			    	
				    }
				  });
				return defer.promise;
			}
		}
	}
	screenShareService.$inject = ['$q'];
	module.exports = screenShareService;
})(window.electronModules);