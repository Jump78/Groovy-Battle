export class EventManager {

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

export let eventManager = new EventManager();
