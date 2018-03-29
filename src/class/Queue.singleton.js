export class Queue {

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

export let queue = new Queue();
