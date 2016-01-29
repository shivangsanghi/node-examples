var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000,function(){
  console.log("listening on port "+app.address().port);
});

function handler (req, res) {
  var url = __dirname + '/public';
  if(req.url == "/"){
    url = url + '/index.html';
  }
  else{
    url = url + req.url;
  }
  fs.readFile(url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var numUsers = 0,
	DEFAULT_ROOM = "chat";
io.on('connection', function (socket) {
  socket.join(DEFAULT_ROOM);
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
  	console.log("adding user");
    if (addedUser) return;

    // we store the username in the socket session for this client
    console.log("username "+username);
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      users:getAllConnectedUsers(socket.id, DEFAULT_ROOM)
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      id: socket.id
    });    
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      console.log("user left : "+socket.username);
      socket.broadcast.emit('user left', {
        username: socket.username,
        id: socket.id
      });
    }
  });

});
  
function getAllConnectedUsers(leaveUserId, room){
	var users = [];
	for(var key in io.sockets.connected){
		var socket = io.sockets.connected[key];
		if(socket.rooms[room] && socket.username && socket.id!==leaveUserId){
			users.push({id:socket.id,username:socket.username});			
		}
	}
	return users;
}