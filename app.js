var express = require('express');
var app = express();
var server=require('http').createServer(app);
var io=require('socket.io')(server);
var nicknames=[];

var routes = require('./routes/index');
var users = require('./routes/users');

app.get('/',function(req,res){

res.sendFile(__dirname +'/views/index.html');
});

io.sockets.on('connection', function(socket){


   socket.on('new user',function(data,callback){
       if(nicknames.indexOf(data)!= -1){
          callback(false);

       }else{

        callback(true);

         socket.nickname=data;
           nicknames.push(socket.nickname);
           updatenicknames();
       }


   });

   function updatenicknames(){

    socket.emit('usernames',nicknames);
   }

     socket.on('send message',function(data){
        io.sockets.emit('new message',{msg:data,nick:socket.nickname});


   });

        socket.on('disconnect',function(data){

         if(!socket.nickname) return;

      nicknames.splice(nicknames.indexOf(socket.nickname),1); 

     updatenicknames();
       
   });


});





server.listen(3000, function(){
console.log('localhost running at 3000 ');



});
module.exports = app;
