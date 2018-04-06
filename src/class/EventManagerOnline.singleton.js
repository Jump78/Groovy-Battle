import socket from 'socket.io-client';

const io = socket('http://192.168.1.18:3000');

export class EventManagerOnline {

  constructor() {
    this.queue = [];

    this.id = null;

    this.init();
  }

  add(message) {
    this.queue.push(message);
    if (!message.player) {
      io.emit('newAction', message);
    }
  }

  getFirst() {
    return this.queue.shift();
  }

  init() {
    const self = this;

    io.on('connect', data => {
      console.log('Connected to serv');
    })

    io.on('connectionAllowed', data => {
      self.id = data.id;
      console.log('Id : ', data.id)
    })

    io.on('newEvent', data => {
      // console.log('new event', data);
      this.add(data);
    })
  }
}

export let eventManagerOnline = new EventManagerOnline();
