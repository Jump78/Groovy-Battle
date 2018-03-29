import socket from 'socket.io-client';

const io = socket('http://localhost:3000');

export class EventManagerOnline {

  constructor() {
    this.queue = [];
  }

  add(message) {
    this.queue.push(message);
  }

  getFirst() {
    return this.queue.shift();
  }
}

export let eventManagerOnline = new EventManagerOnline();
