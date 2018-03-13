export default class {
  constructor( option = {} ) {
    this.health = option.health || option.maxHealth || 10;
    this.maxHealth = option.maxHealth || 10;
    this.minHealth = option.minHealth || 0;

    this.energy = option.energy || option.maxEnergy || 100;
    this.maxEnergy = option.maxEnergy || 100;
    this.minEnergy = option.minEnergy || 0;

    this.defense = option.defense || 40;
    this.damage = option.damage || 2;
    this.criticalMultiplicator = option.criticalMultiplicator || 2.5;
    this.speed = 1;
  }

  increase(name, number){
    let maxStat = 'max' + name.replace(name[0], name.charAt(0).toUpperCase());
    this[name] += number;

    if (this[maxStat] && this[name] > this[maxStat]) {
      this[name] = this[maxStat];
    }

    return this[name];
  }

  decrease(name, number){
    let minStat = 'min' + name.replace(name[0], name.charAt(0).toUpperCase());
    this[name] -= number;

    if ((this[minStat] != "undifined" || this[minStat] != null) && this[name] < this[minStat]) {
      this[name] = this[minStat];
    }

    return this[name];
  }
}
