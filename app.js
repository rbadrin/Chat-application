const app = require('express')();
const http= require('http').Server(app);
const io= require('socket.io')(http);

var clients=[];
// var clients_2=[];.

app.get('/',function(req,res)  {
res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(socket)  {
  socket.on('setUsername',function(data){
    if(clients.indexOf(data)>-1){
      socket.emit('Error',"Already "+data+" taken");
      console.log("Duplicate username error");
    }
    else{
      clients.push(data);
      socket.emit('User connected',{name : data,room : data.room});
      io.emit('users online',clients);
      console.log("user connected "+ data);
    }
  });
  socket.on('Chatting',function(data){
    console.log(data);
    io.sockets.emit('displaymsg',{msg: data,cli : clients} );
  });
  socket.on('quittt',function(data){
    console.log("user disconnected "+data);
    clients.splice(clients.indexOf(data),1);
    socket.disconnect();
  });
});





http.listen(5000, function() { 
   console.log("server has started running on port");
});
