(function() {
    var Constants = require('./constants');
    var self,
        rows = Constants.rows;
    /*Creating user class*/
    var UserList = function() {
        self = this;
        this.id = (new Date()).getTime();
        this.list = [];
    }

    /*Sending message to the user via saved websocket*/
    UserList.prototype.sendMessage = function(eventname, message) {
        for (var i = 0; i < this.list.length; i++) {
            this.list[i].sendMessage(eventname, message);
        };
    }

    // Add the number to list and sort the list.
    UserList.prototype.addUser = function(user) {
        this.list.push(user);
    }

    UserList.prototype.getList = function() {
        var list = [];
        for (var i = 0; i < this.list.length; i++) {
            var user = this.list[i];
            // returning only those users who are not involve in any game.
            if(user.partner){
                continue;
            }
            list.push(user.getInfo());
        };
        console.log(list);
        return list;
    }

    module.exports = UserList;

})();