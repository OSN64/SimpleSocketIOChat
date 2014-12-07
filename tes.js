var S = require('string');
var util = require('util');
var User = require("./user").User;

var users = [];

// setInterval(function(){
// 	console.log(users);

// },5000);



var newUser = new User(1, "assa");
users.push(newUser);
newUser = new User(2, "a");
users.push(newUser);
newUser = new User(3, "qe");
users.push(newUser);
newUser = new User(4, "tr");
users.push(newUser);
newUser = new User(5, "df");
users.push(newUser);

function userByID(id) {
    var i;
    for (i = 0; i < users.length; i++) {
        if(users[i].id === id)
            return users[i];
    };

    return false;
};

console.log("name " +userByID(4).name);