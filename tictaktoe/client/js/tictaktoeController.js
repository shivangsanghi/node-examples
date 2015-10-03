angular.module('tictaktoeModule').controller('tictaktoeController', function($scope, $window, tictaktoeService) {    
    // watching change in userlist; 
    $scope.$watch(function(){return tictaktoeService.getUserList();},function(newval){
    	if(newval){
    		$scope.userList = newval;    		    	    		
    	}
    });

    // watching change in gameStatus flag; 
    $scope.$watch(function(){return tictaktoeService.getUserInfo();},function(newval){        
        if(newval){
            $scope.gameStatus = newval.status;
            $scope.name = newval.name;
            $scope.id = newval.id;
        }
    });

    // watching change in numberList event to update the values on board; 
    $scope.$watch(function(){return tictaktoeService.getNumberList();},function(newval){        
        if(newval){
            $scope.numberList = newval;
        }
    });

    // watching gameDate to update and create tictaktoe board; 
    $scope.$watch(function(){return tictaktoeService.getGameData();},function(newval){
        if(newval){
            $scope.gameData = newval;
            $scope.boxes = [];
            for (var i = 0; i < newval.rows*newval.rows; i++) {
               $scope.boxes.push(i+1);
           };                                           
        }
    });

    $scope.selectUser = function(user){
        $scope.selectedUser = user;
    }

    $scope.startGame = function(){
        tictaktoeService.startGame($scope.selectedUser);
    }

    $scope.stopGame = function(){
        tictaktoeService.stopGame($scope.selectedUser);
    }

    $scope.addNumber = function(index){
        tictaktoeService.addNumber($scope.selectedUser, index);
    }
});