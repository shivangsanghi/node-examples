(function() {
    var Global = require('./global');
    var Constants = require('./constants');
    var rows = Constants.rows;
    // Check if number exists in list.
    var Game = {
        numberList: [],
        numberExist: function(number) {
            return this.numberList.indexOf(number) > -1;
        },
        // Check if the row exists.
        isRow: function(number) {
            // first check the number is the starting value of row.
            var isRow = (number % rows == 0);
            if (isRow) {
                for (var i = 1; i < rows; i++) {
                    isRow = isRow && this.numberExist(number + i);
                }
            }
            if (isRow) {
                console.log(":: ROW FOUND ::");
            }
            return isRow;
        },
        // Check if the column exists.
        isColumn: function(number) {
            // first check the number is the starting value of column.
            var isColumn = number < rows;
            if (isColumn) {
                for (var i = 1; i < rows; i++) {
                    isColumn = isColumn && this.numberExist(number + i * rows);
                }
            }
            if (isColumn) {
                console.log(":: COLUMN FOUND ::");
            }
            return isColumn;
        },
        // Check if the diagonal exists.
        isDaigonal: function isDaigonal(number) {
            var isLeftDaigonal = this.numberExist(0);
            var isRightDaigonal = this.numberExist(rows - 1);
            // var isDaigonal = this.numberExist(0) || this.numberExist(rows - 1);
            if (isLeftDaigonal) {
                for (var i = 1; i < rows; i++) {
                    isLeftDaigonal = isLeftDaigonal && this.numberExist(i * rows + i);
                }
            } 
            if (isRightDaigonal) {
                for (var i = 1; i < rows; i++) {
                    isRightDaigonal = isRightDaigonal && this.numberExist((i + 1) * (rows - 1));
                }
            }

            if (isLeftDaigonal) {
                console.log(":: LEFT DAIGONAL FOUND ::");
            } else if (isRightDaigonal) {
                console.log(":: RIGHT DAIGONAL FOUND ::");
            }
            return isLeftDaigonal || isRightDaigonal;
        },
        // Function to check sudoku is finished by check if row,column or diagonal is completed.
        isFinished: function(numberList) {
            this.numberList = numberList;
            console.log(this.numberList);
            var finished = false;
            for (var i = 0; i < this.numberList.length; i++) {
                var number = this.numberList[i];
                finished = this.isRow(number) || this.isColumn(number) || this.isDaigonal(number);
                if (finished) {
                    this.numberList = [];
                    return finished;
                }
            };
            return false;
        }
    };

    /*Creating user class*/
    var User = function(user) {
        var self = this;
        this.id = (new Date()).getTime();
        this.name = 'User-' + this.id;
        this.partner = null;
        this.status = Constants.gameStatus.stopped;
        this.numberList = [];
        /*Timestamp when number was added*/
        this.numberAddedTS = 0;
        this.update(user);


        /*Adding event of socket*/
        this.socket.on(Constants.events.addNumber, function(obj) {
            if (self.numberAddedTS > self.partner.numberAddedTS) {
                return;
            }
            self.numberAddedTS = (new Date()).getTime();
            self.addNumber(obj.number);
            var users = [self, self.partner];
            var combinedNumberList = {};
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                for (var j = 0; j < user.numberList.length; j++) {
                    var number = user.numberList[j];
                    combinedNumberList[number] = user.name;
                }
            }

            /*Send numberList event to both users*/
            for (var i = 0; i < users.length; i++) {
                var user = users[i];                
                user.sendMessage(Constants.events.numberList, combinedNumberList);
                /*If user has finished the game then send won status to him and failed status to partner*/
                var isFinished = Game.isFinished(user.numberList);
                if(isFinished){                    
                    user.update({"status":Constants.gameStatus.won});
                    user.partner.update({"status":Constants.gameStatus.failed});
                    self.sendMessage(Constants.events.userInfo, self.getInfo());
                    self.partner.sendMessage(Constants.events.userInfo, self.partner.getInfo());                    
                }                        
            }

        });

        this.socket.on(Constants.events.startGame, function(obj) {
            var partner = Global.filter(Global.userList.list, 'id', obj.partnerId);
            /*Set partners*/
            self.update({
                partner: partner,
                status: Constants.gameStatus.started
            });
            partner.update({
                partner: self,
                status: Constants.gameStatus.started
            });

            /*Send updated user list to all recipients*/
            Global.userList.sendMessage(Constants.events.userList, Global.userList.getList());

            /*Update users with self and partner info.*/
            self.sendMessage(Constants.events.userInfo, self.getInfo());
            partner.sendMessage(Constants.events.userInfo, self.partner.getInfo());

            /*Send game data for creating board*/
            self.sendMessage(Constants.events.gameData, {
                "rows": rows,
                "boxSize": Constants.boxSize
            });
            partner.sendMessage(Constants.events.gameData, {
                "rows": rows,
                "boxSize": Constants.boxSize
            });
        });

        /*Remove the user from the list once refresh button is clicked or user manually logout himself*/
        this.socket.on(Constants.events.logout, function(message) {
            console.log('User logged out - ' + self.name);
            /*Disconnecting current client socket*/
            self.logout();
            /*Removing current client from userlist*/
            var index = Global.userList.list.indexOf(self);
            Global.userList.list.splice(index, 1);

            // Remove this client from partner. 
            if (self.partner) {
                self.partner.update({
                    partner: null,
                    numberList: [],
                    status: Constants.gameStatus.stopped
                });
                self.partner.sendMessage(Constants.events.userInfo, self.partner.getInfo());
            }
            /*Send updated user list to all recipients*/
            Global.userList.sendMessage(Constants.events.userList, Global.userList.getList());

        });

        this.socket.on(Constants.events.stopGame, function(message) {
            console.log('User logged out - ' + self.name);
            // Remove this client from partner.
            self.partner.update({
                partner: null,
                numberList: [],
                status: Constants.gameStatus.stopped
            });
            // Remove partner from this client.
            self.update({
                partner: null,
                numberList: [],
                status: Constants.gameStatus.stopped
            });

            /*Send updated user list to all recipients*/
            Global.userList.sendMessage(Constants.events.userList, Global.userList.getList());

            self.partner.sendMessage(Constants.events.userInfo, self.partner.getInfo());
            self.sendMessage(Constants.events.userInfo, self.getInfo());
        });

            }

    /*Sending message to the user via saved websocket*/
    User.prototype.sendMessage = function(eventname, message) {
        this.socket.emit(eventname, message);
    }

    // Remove user from list
    User.prototype.logout = function(message) {
        /*sending numberlist to all users*/
        this.socket.disconnect();
    }

    // Remove user from list
    User.prototype.update = function(obj) {
        // update user name 
        Global.Util._extend(this, obj);
    }

    // Add the number to list and sort the list.
    User.prototype.addNumber = function(number) {
        if (!isNaN(number)) {
            this.numberList.push(number);
            this.numberList.sort();
        } else {
            console.log('Please add numbers only!');
        }
    }

    // Return the information of user
    User.prototype.getInfo = function() {
        var newuser = {};
        newuser.name = this.name;
        newuser.id = this.id;
        newuser.status = this.status;
        if (this.partner) {
            newuser.partner = {};
            newuser.partner.name = this.partner.name;
            newuser.partner.id = this.partner.id;
            newuser.partner.status = this.partner.status;
        }
        return newuser;
    }   

    module.exports = User;

})();