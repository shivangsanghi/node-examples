(function() {    
    var Constants = require('./constants');
    var Global = require('./client');
    var User = require('./user');
    var Global = require('./global');
    var io = require('socket.io').listen(Constants.port);
    io.sockets.on('connection', function(socket) {
        var user = new User({'socket':socket});
        Global.userList.addUser(user);
        user.sendMessage(Constants.events.userInfo,user.getInfo());
        Global.userList.sendMessage(Constants.events.userList,Global.userList.getList());
    });
})();