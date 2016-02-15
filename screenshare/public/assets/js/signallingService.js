(function() {
    var socket,
        addedSocketEvents = {},
        SERVER_PATH = 'http://localhost:3000';
    var signallingService = function() {
        return {
            connect: function() {
                if (!socket) {
                    socket = io(SERVER_PATH);
                }
                return this;
            },
            send: function(eventName, data) {
                if (socket) {
                    socket.emit(eventName, data);
                }
                return this;
            },
            add: function(eventName, callback) {
                if (socket) {
                    // storing all socket events added from outside in order to not override 
                    // the previous event and creating a list of callback
                    if (!addedSocketEvents[eventName]) {
                        addedSocketEvents[eventName] = [];
                        addedSocketEvents[eventName].push(callback);
                        socket.on(eventName, function(data) {
                            console.log("Got data from socket with eventName:" + eventName);
                            var callbacks = addedSocketEvents[eventName];
                            for (var i = 0; i < callbacks.length; i++) {
                                callbacks[i](data);
                            };
                        });
                    } else {
                        addedSocketEvents[eventName].push(callback);
                    }

                    return this;
                }
            }
        }
    }

    module.exports = signallingService;
})();