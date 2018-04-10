var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

var clients = 0;
var rooms = [];
var users = [];
io.on('connection', function(socket) {
    var clientid = socket.id;
    console.log("socket id...",socket.id);

    clients++;
    //console.log('add user data...',data);

    socket.on('add user',function(data){
        console.log('add user data...',data);
        if(users.indexOf(data) >= 0){
            console.log('socket is in the room');
            io.sockets.emit('login',{});
        }else {
            users.push(data);
            rooms.push(socket.id);
            io.sockets.emit('login', {numUsers: clients, socketid: socket.id});
        }
    });
    socket.on('users',function (data) {
        console.log('add user data...',data);
        io.sockets.emit('users', {users:users});
    });
    socket.on('new message',function(data){
        console.log('new message data..',data);
        if(rooms.indexOf(data.socketid) >= 0){
            console.log('socket is in the room');
        }
        io.sockets.emit('new message',{username:data.username,message:data.message});
    });
    socket.on('user joined',function (data) {
        console.log('user joined data',data);
        io.sockets.emit('user joined',{username:username,numUsers:clients});
    });
    socket.on('user left',function (data) {
        console.log('user left data',data);
        io.sockets.emit('user left',{username:username,numUsers:clients});
    });
    socket.on('typing',function (data) {
        console.log('user typing',data);
        io.sockets.emit('typing',{username:data});
    });
    socket.on('stop typing',function (data) {
        io.sockets.emit('stop typing',{username:data.username});
    });

    io.sockets.emit('broad cast',{ description: clients + ' clients connected!'});
    socket.on('reply to',function(data){
        console.log('received from client...',data);
    });
    socket.on('disconnection',function (data) {
        console.log('disconnection data..',data);
        rooms.pop(data);
    });
    socket.on('disconnect', function () {
        clients--;
        io.sockets.emit('' +
            '',{ description: clients + ' clients connected!'});
    });
});

http.listen(3000, function() {
    console.log('listening on localhost:3000');
});