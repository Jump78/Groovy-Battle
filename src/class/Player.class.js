const defaultFunc = () => {};

export default class {
  constructor( option = {} ) {
    this.name = option.name || 'Noname';
    this.currentLife = option.life || 10;
    this.maxLife = option.maxLife || 10;

    this.currentEnergy = option.currentEnergy || 10;
    this.maxEnergy = option.maxEnergy || 10;

    this.score = option.score || 0;

    this.keyboard = option.keyboard || {};

    this.arrowManager = option.arrowManager || {};

    this.update = option.update || defaultFunc;
    this.render = option.render || defaultFunc;

    this.startAt = Date.now();
  }
}
