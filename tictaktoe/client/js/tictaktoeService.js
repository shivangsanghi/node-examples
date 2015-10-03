angular.module('tictaktoeModule').service('tictaktoeService', function($rootScope) {
    var socket = io.connect('http://localhost:3000'),
        self = this;
    _userList = [],
    _gameData = {},
    _userInfo = {};
    _numberList = {};

    this.setUserList = function(userList) {
        _userList = userList;
        $rootScope.$digest();
    }

    this.getUserList = function() {
        return _userList;
    }

    this.setGameData = function(gameData) {
        _gameData = gameData;
        $rootScope.$digest();
    }

    this.getGameData = function() {
        return _gameData;
    }

    this.setUserInfo = function(userInfo) {
        _userInfo = userInfo;
        $rootScope.$digest();
    }

    this.getUserInfo = function() {
        return _userInfo;
    }

    this.setNumberList = function(numberList) {
        _numberList = numberList;
        $rootScope.$digest();
    }

    this.getNumberList = function() {
        return _numberList;
    }
    /*----------------Event that are send by nodejs server and listen by client-----------------------------*/

    // listining for userlist event to update the list of users
    socket.on('userList', function(data) {
        self.setUserList(data);
    });

    // listening gameData event to create the board
    socket.on('gameData', function(data) {
        self.setGameData(data);
    });

    // listening userInfo event to update the user details about id,name and his status.
    socket.on('userInfo', function(data) {
        self.setUserInfo(data);
    });

    // listening numberList event to fill the board
    socket.on('numberList', function(data) {
        self.setNumberList(data);
    });

    /*---------------------Sending event to nodejs server---------------------------------------------------*/
    /*PartnerId is required to add partner for this user*/
    this.startGame = function(user) {
        socket.emit('startGame', {
            partnerId: user.id
        });
    }

    this.stopGame = function(user) {
        /*Stop the game so that this client and partner get available for other*/
        socket.emit('stopGame');
    }

    this.addNumber = function(user, index) {
        socket.emit('addNumber', {
            number: index
        });
    }
});