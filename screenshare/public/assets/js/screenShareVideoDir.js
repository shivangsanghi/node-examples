(function() {
    var screenShareVideoDir = function() {
    	var videoElem;
			

    	return {
    		restrict: 'A',
    		scope: {
    			stream: '='
    		},
    		template:'<video autoplay="true"></video>',
    		controller: function($scope){
    			$scope.$watch('stream', function(stream){
    				if(stream){
				  		videoElem.src = URL.createObjectURL(stream);    		    		
    				}
				});
    		},
    		link: function($scope, elem, attr){
    			videoElem = elem.find('video')[0];
    		}

    	};    	
    }
    module.exports = screenShareVideoDir;
})();