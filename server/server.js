const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


let players_lst = [];

let eventList = [];

io.on('connection', function(socket){
  console.log('a user connected');

  if (players_lst.length > 2) return;

  if (players_lst.indexOf('disconnected') >= 0) {
    players_lst[players_lst.indexOf('disconnected')] = socket.id;
  } else {
    players_lst.push(socket.id);
  }

  socket.on('newAction', function (data) {
    console.log((players_lst.indexOf(socket.id) + 1) +' as', data.type, data.spell);

    data.player = players_lst.indexOf(socket.id) + 1;

    eventList.push(data);
  });

  socket.on('disconnect', data => {
    players_lst[players_lst.indexOf(socket.id)] = 'disconnected';
  })

  socket.emit('connectionAllowed', {id: players_lst.indexOf(socket.id) + 1});
});

function eventDeal() {
  const eventToDeal =  eventList.shift();
  if (!eventToDeal) return;

  if (eventToDeal.player == 1) {
    io.sockets.to(players_lst[1]).emit('newEvent', eventToDeal);
  } else if (eventToDeal.player == 2){
    io.sockets.to(players_lst[0]).emit('newEvent', eventToDeal);
  }
}

http.listen(3000, function(){
  console.log('listening on *:3000');

  setInterval(eventDeal, 10);
});
