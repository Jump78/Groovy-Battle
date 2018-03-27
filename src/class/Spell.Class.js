export default class {
  constructor (option){
    this.name = option.name || '';
    this.description = option.description || '';
    this.incantation = option.incantation ||'';
    this.effect = option.effect || {};
    this.self = option.self || false;
    this.currentRepeat = 0;
  }

  use (target, statBonus, isCrit, comboMultiplier = 1){
    if (this.effect.damage > 0) {
      let multiplicator = isCrit? statBonus.criticalMultiplicator : 1;
      let damage = this.effect.damage + (this.effect.damage * (statBonus.damage * 0.05));
      target.takeDamage(damage * comboMultiplier * multiplicator );
    }

    if (this.effect.energyRestore > 0) {
      target.stats.increase('energy', this.effect.energyRestore);

    }

    if (this.effect.healthRestore > 0) {
      target.stats.increase('health', this.effect.healthRestore);
    }

    if (this.effect.speed != 1) {
      target.stats.increase('speed', this.effect.speed);
    }

    if(this.effect.repeat > 0){
      this.currentRepeat++;
      setTimeout(this.use, this.effect.delay, target);
    }
  }

  increase(name, number){
    return this.effect[name] += number;
  }

  decrease(name, number){
    return this.effect[name] -= number;
  }

  multiplicate(name, number){
    return this.effect[name] *= number;
  }

  divide(name, number){
    return this.effect[name] /= number;
  }
}
