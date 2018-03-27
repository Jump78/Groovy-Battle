///TODO function init Value
export default class {
  constructor( option = {} ) {
    this.health = option.health || option.maxHealth || 75;
    this.maxHealth = option.maxHealth || 75;
    this.minHealth = option.minHealth || 0;

    this.energy = option.energy || option.maxEnergy || 100;
    this.maxEnergy = option.maxEnergy || 100;
    this.minEnergy = option.minEnergy || 0;

    this.defense = option.defense || 40;
    this.damage = option.damage || 2;
    this.criticalMultiplicator = option.criticalMultiplicator || 3;
    this.speed = 1;
    this.comboMultiplier = option.comboMultiplier || 1;
    this.defaultValue = {};

    Object.assign(this.defaultValue, this);
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

  /**
   * Reset each stat has the initial value
   */
  reset(){
    for (let prop in this) {
      if (prop == 'option') continue;
      this[prop] = this.defaultValue[prop];
    }
  }
}
