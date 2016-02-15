var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000,function(){
  console.log("listening on port "+app.address().port);
});

function handler (req, res) {
  return;
}

var numUsers = 0,
  DEFAULT_ROOM = "chat";
io.on('connection', function (socket) {
  socket.join(DEFAULT_ROOM);
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    if(data.peerId !== ''){
      var receiver = getSocket(data.peerId, DEFAULT_ROOM);
      if(receiver){
        receiver.emit('new message', {
          username: socket.username,
          message: data.message
        });  
      }
    }
    else{
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data.message
      });      
    }
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
      id: socket.id,
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

  // when the user accepted the screen sharing.. 
  socket.on('share screen', function (data) {
    if(data.peerId !== ''){
      var receiver = getSocket(data.peerId, DEFAULT_ROOM);
      if(receiver){
        receiver.emit('share screen', {
          username: socket.username,
          id: socket.id
        });  
      }
    }
  });

  // when the user accepted the screen sharing.. 
  socket.on('share screen status', function (data) {
     console.log("share screen status : "+data.senderId);
    if(data.senderId !== ''){
      var sender = getSocket(data.senderId, DEFAULT_ROOM);
      if(sender){
        sender.emit('share screen status', {
          username: socket.username,
          status: data.status
        });  
      }        
    }
  });

  socket.on('share offer', function (offer) {
    console.log('socket:: Share Offer, peerId::'+offer.peerId);
    if(offer.peerId !== ''){
      var receiver = getSocket(offer.peerId, DEFAULT_ROOM);
      if(receiver){
        console.log('Has receiver');
        receiver.emit('offer received', {
          sdp: offer.sdp,
          senderId: offer.senderId
        });  
      }        
    }
  });

  socket.on('share answer', function (answer) {
    console.log('socket:: Share Answer');
    if(answer.senderId !== ''){
      var sender = getSocket(answer.senderId, DEFAULT_ROOM);
      if(sender){
        sender.emit('answer received', {
          sdp: answer.sdp
        });  
      }        
    }
  });

   socket.on('share ice candidate', function (data) {
    console.log('socket:: Share Ice Candidate');
    if(data.peerId !== ''){
      var receiver = getSocket(data.peerId, DEFAULT_ROOM);
      if(receiver){
        receiver.emit('ice candidate received', {
          candidate: data.candidate
        });  
      }        
    }
  });

  socket.on('close sender peer connection', function (data) {
    console.log('socket:: Closing sender peer connection');
    if(data.senderId !== ''){
      var sender = getSocket(data.senderId, DEFAULT_ROOM);
      if(sender){
        sender.emit('close peer connection', {
        });  
      }        
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

function getSocket(socketId, room){
  var users = [];
  for(var key in io.sockets.connected){
    var socket = io.sockets.connected[key];
    if(socket.rooms[room] && socket.username && socket.id===socketId){
      return socket;      
    }
  }
  return false;
}