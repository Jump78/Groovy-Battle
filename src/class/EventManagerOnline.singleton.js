import socket from 'socket.io-client';

const io = socket('http://localhost:3000');

export class EventManagerOnline {

  constructor() {
    this.queue = [];

    this.id = null;
  }

  add(message) {
    if (!message.player) {
      message.player = this.id;
      io.emit('newAction', message);
    }
    this.queue.push(message);
  }

  getFirst() {
    return this.queue.shift();
  }

  onNewPlayer () {

  }

  init() {
    const self = this;

    io.on('connect', data => {
      console.log('Connected to serv');
      io.emit('newPlayer');
    })

    io.on('connectionAllowed', data => {
      self.id = data.id;
      console.log('Id : ', data.id);
    })

    io.on('newPlayer', data => {
      console.log('New player');
      this.onNewPlayer();
    })

    io.on('newEvent', data => {
      // console.log('new event', data);
      this.add(data);
    })
  }
}

export let eventManagerOnline = new EventManagerOnline();
