(function() {
    var baseController = function($scope, baseService, eventManager) {
    	$scope.showSharePanel = false;
    	eventManager.addEvent('showPanel', function(event, data){
    		switch(data.name){
    			case 'sharing_panel': $scope.showSharePanel = true;
    									break;    									
    		}
    	});
    }
    baseController.$inject = ['$scope', 'baseService', 'eventManager'];
    module.exports = baseController;
})();