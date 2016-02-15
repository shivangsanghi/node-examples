(function() {
    /*Controller defination*/
    var chatController = function($scope, signallingService, eventManager, sharingUser) {
        $scope.connected = false;
        $scope.message = "";
        $scope.messages = [];
        $scope.userlist = [];
        $scope.username = "";
        $scope.peerId = "";
        $scope.sharingUser = sharingUser;
        signallingService.connect()
        // Whenever the server emits 'login', log the login message
        .add('login', function(data) {
            $scope.$apply(function() {
                $scope.connected = true;
                // Display the welcome message
                var message = "Welcome to Socket.IO Chat – ";
                $scope.messages.push({
                    type: 'log',
                    message: message
                });
                $scope.userlist = data.users;
                sharingUser.id(data.id);
                $scope.messages.push({
                    type: 'info',
                    message: "Total online users: " + $scope.userlist.length
                });

                eventManager.dispatchEvent('ChatModuleEvent', {
                    eventName: 'userLoggedIn',
                    id: sharingUser.id()
                });
            })
        })

        // Whenever the server emits 'new message', update the chat body
        .add('new message', function(data) {
            $scope.$apply(function() {
                $scope.messages.push({
                    type: 'message',
                    message: data
                });
            })
        })

        // Whenever the server emits 'user joined', log it in the chat body
        .add('user joined', function(data) {
            $scope.$apply(function() {
                // adding a new user in the list
                $scope.userlist.push(data);
                $scope.messages.push({
                    type: 'log',
                    message: data.username + ' joined'
                });
            })
        })

        // Whenever the server emits 'user left', log it in the chat body
        .add('user left', function(data) {
            $scope.$apply(function() {
                $scope.userlist = $scope.userlist.filter(function(user) {
                    return sharingUser.id !== data.id;
                });
                $scope.messages.push({
                    type: 'log',
                    message: data.username + ' left'
                });
            })
        });


        $scope.login = function() {
            sharingUser.username($scope.username);
            signallingService.send("add user", sharingUser.username());
        }

        $scope.sendMessage = function() {
            if ($scope.message) {
                $scope.messages.push({
                    type: 'message',
                    message: {
                        username: 'Me',
                        message: $scope.message
                    }
                });
                signallingService.send("new message", {
                    message: $scope.message,
                    peerId: sharingUser.peerId()
                });
                $scope.message = "";
            }
        }

        $scope.selectReceiver = function(_user) {
            if (sharingUser.peerId() === sharingUser.id) {
                sharingUser.peerId('');
                sharingUser.isSender(false);
            } else {
                sharingUser.peerId(_user.id);
                sharingUser.isSender(true);
            }

        }

        $scope.shareScreen = function(user) {
            eventManager.dispatchEvent('showPanel', {
                'name': 'sharing_panel',
                user: user
            });
        }
    }


    chatController.$inject = ['$scope', 'signallingService', 'eventManager', 'sharingUser'];
    module.exports = chatController;
})();