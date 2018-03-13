export default class {
  constructor (option){
    this.name = option.name || '';
    this.description = option.description || '';
    this.incantation = option.incantation ||'';
    this.effect = option.effect || {};
    this.self = option.self || false;
    this.currentRepeat = 0;
  }

  use (target){
    if (this.effect.damage > 0) {
      target.takeDamage(this.effect.damage);
    }

    if (this.effect.energyRestore > 0) {
      target.currentEnergy += this.effect.energyRestore;
    }

    if (this.effect.healthRestore > 0) {
      target.currentLife += this.effect.healthRestore;
    }

    if (this.effect.speed != 1) {
      target.speed *= this.effect.speed
    }

    if(this.effect.repeat > 0){
      this.currentRepeat++;
      setTimeout(this.use, this.effect.delay, target);
    }
  }

  increase(name, number){
    return this[name] += number;
  }

  decrease(name, number){
    return this[name] -= number;;
  }

  multiplicate(name, number){
    return this[name] *= number;
  }

  divide(name, number){
    return this[name] /= number;;
  }
}
