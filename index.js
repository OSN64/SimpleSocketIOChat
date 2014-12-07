var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var S = require('string');
var util = require('util');
var User = require("./user").User;

io.set("transports", ["websocket"]);

app.get('/', function(req, res){
   res.sendfile('index.html');
});
app.get('/playSound.js', function(req, res){
   res.sendfile('playSound.js');
});
app.get('/notification.mp3', function(req, res){
   res.sendfile('notification.mp3');
});
var nouser = 0;

var users = [];


var clients = {};
setInterval(function(){
	console.log(users);
},10000);
// var users
io.on('connection', function(socket){

	// var address = socket.handshake.address.address;
	var clientIpAddress= socket.request.socket.remoteAddress;
	console.log("New connection! ID= " + socket.id);
	var informworld = "User connected from: " + clientIpAddress;
	console.log(informworld);
	clients[socket.id] = socket;

	currentusers(socket);

	socket.on('entered', function(user){
		user = user + ' ';
		user = user.trim();
		user = S(user).stripTags().s;
		var nfound = userByName(user);

		if (user != "" && nfound.name != user){

			var newUser = new User(socket.id, user);
			users.push(newUser);
			console.log("User " + newUser.name + " just entered");
			io.emit('entered', {user:newUser.name , justconnect:true});

			socket.on('chat message', function(msg){
				// msg = S(msg).stripTags().s;
				var ufound = userByID(socket.id);

				if (ufound && msg != ""){
					io.emit('chat message', ufound.name, {date:getDateTime(), msg: msg});
					// console.log(socket.id);
				}else{
					socket.emit("broadcast","Fuck off");
					socket.disconnect();
				}
			});

			socket.on('typing', function(data){
				io.emit('typing', data);
			});
			socket.on('online', function(name){
				// io.emit('online', name);
			});

		}else{
			socket.emit("broadcast","Please refresh and choose a diferent name");
			socket.disconnect();
		}

	});

	socket.on('disconnect', function(){
		var username = userByID(socket.id).name;
		io.emit('userdisconnect', username);
		console.log(username + ' disconnected ');
		deluserByID(socket.id);

	});


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

process.on('SIGINT', function() {
	io.emit('broadcast', "Server is going down, Refresh page");
	setTimeout(function(){
		process.exit();
	}
	, 2000); // 20seconds
});
function currentusers(socket){
	for (var i = 0; i < users.length; i++) {
		console.log("send: " + users[i].name);
		socket.emit("entered",{user:users[i].name , justconnect:false});
	};
}
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

function userByID(id) {
    var i;
    for (i = 0; i < users.length; i++) {
        if(users[i].id === id)
            return users[i];
    };

    return false;
};
function userByName(name) {
    var i;
    for (i = 0; i < users.length; i++) {
        if(users[i].name === name)
            return users[i];
    };

    return false;
};
function deluserByID(id) {
    var i;
    for (i = 0; i < users.length; i++) {
        if(users[i].id === id)
            return users.splice(i, 1);
    };

    return false;
};

//printing object
// var util = require('util');
// console.log(util.inspect(object, false, null ));

//other shit
