const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuidv4 = require('uuid/v4');

let roomList = [];

class Room {
  constructor() {
    this.id = uuidv4();
    this.playersList = [];
    this.maxNumber = 2;
    this.eventList = [];

    roomList.push(this);
  }

  eventDeal() {
    const eventToDeal =  this.eventList.shift();
    if (!eventToDeal) return;

    if (eventToDeal.player == 1) {
      io.sockets.to(this.playersList[1].id).emit('newEvent', eventToDeal);
    } else if (eventToDeal.player == 2){
      io.sockets.to(this.playersList[0].id).emit('newEvent', eventToDeal);
    }
  }
}

class Player {
  constructor(option = {}) {
    this.id = option.id || null;
    this.roomId = option.roomId || '';
    this.name = option.name ||'';
    this.playerId = option.playerId || 0;
  }
}

function findRoom() {
  for (let i = 0; i < roomList.length; i++) {
    if (roomList[i].playersList.length < roomList[i].maxNumber)
      return roomList[i];
  }

  let newRoom = new Room();
  return newRoom;
}

io.on('connection', function(socket){
  console.log('a user connected');
  let room = findRoom();

  let player = new Player({
    id: socket.id,
    roomId: room.id,
    playerId: room.playersList.length+1
  })

  socket.join(room.id);
  room.playersList.push(player);

  socket.on('newAction', function (data) {
    console.log('Player '+ player.playerId + ' of room id '+ room.id +' as', data.type, data.spell);

    data.player = player.playerId;

    room.eventList.push(data);
  });

  socket.on('disconnect', function (data) {
    
  });

  socket.emit('connectionAllowed', {id: player.playerId});
  socket.broadcast.to(room.id).emit('newPlayer');
  if (room.playersList.length == 2) socket.emit('newPlayer');
});

http.listen(3000, function(){
  console.log('listening on *:3000');

  setInterval(_ => {
    roomList.forEach(room => {
      room.eventDeal();
    })
  }, 10);
});
