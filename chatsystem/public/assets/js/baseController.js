(function() {
    var baseController = function($scope, socketService) {
    	$scope.connected = false; 
    	$scope.message = "";
    	$scope.messages = [];
    	$scope.username = ""; 
    	$scope.userlist = [];
        socketService.connect()
	        // Whenever the server emits 'login', log the login message
	        .add('login', function(data) {
	        	$scope.$apply(function(){ 
		            $scope.connected = true;
		            // Display the welcome message
		            var message = "Welcome to Socket.IO Chat – ";
		            $scope.messages.push({type:'log',message:message});
		            $scope.userlist = data.users;
		            console.log($scope.userlist); 
		            $scope.messages.push({type:'info',message:"Total online users: "+$scope.userlist.length});	        		
	        	})
	        })

	        // Whenever the server emits 'new message', update the chat body
	        .add('new message', function(data) {
	        	$scope.$apply(function(){		        	
		            $scope.messages.push({type:'message',message:data});
		        })
	        })

	        // Whenever the server emits 'user joined', log it in the chat body
	        .add('user joined', function(data) {
	        	$scope.$apply(function(){
	        		// adding a new user in the list
	        		$scope.userlist.push(data);
		            $scope.messages.push({type:'log',message:data.username + ' joined'});
		        })
	        })

	        // Whenever the server emits 'user left', log it in the chat body
	        .add('user left', function(data) {
	        	$scope.$apply(function(){
	        		$scope.userlist = $scope.userlist.filter(function(user){
	        			return user.id !== data.id;
	        		});		            
		            $scope.messages.push({type:'log',message:data.username + ' left'});
		        })
	        });


	    $scope.login = function(){
	    	socketService.send("add user", $scope.username);
	    }

	    $scope.sendMessage = function(){ 
	    	if($scope.message){
		    	$scope.messages.push({type:'message',message:{username:'Me',message:$scope.message}});
		    	socketService.send("new message",$scope.message);
		    	$scope.message = "";	    		
	    	}
	    }
    }
    baseController.$inject = ['$scope', 'socketService'];
    module.exports = baseController;
})();