export class EventManager {

  constructor() {
    this.queue = [];

    this.playerName = ['Player1', 'Player2']
  }

  add(message) {
    if (!message.player) {
      message.player = this.playerName.indexOf(message.playerName) + 1;
    }
    this.queue.push(message);
  }

  getFirst() {
    return this.queue.shift();
  }
}

export let eventManager = new EventManager();
