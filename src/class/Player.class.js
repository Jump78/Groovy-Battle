const defaultFunc = () => {};

export default class {
  constructor( option = {} ) {
    this.name = option.name || 'Noname';
    this.isDie = option.isDie || false;
    this.currentLife = option.life || 10;
    this.maxLife = option.maxLife || 10;

    this.currentEnergy = option.currentEnergy || 100;
    this.maxEnergy = option.maxEnergy || 100;

    this.spells = option.spells;

    this.score = option.score || 0;

    this.keyboard = option.keyboard || {};

    this.arrowManager = option.arrowManager || {};

    this.update = option.update || defaultFunc;
    this.render = option.render || defaultFunc;

    this.mode = 'attack';
    this.defense = 0.00001;
    this.defenseSuccess = false;

    this.isUltraMode = false;
    this.incantation = [];
    this.canAddIncantation = true;

    this.globalCooldown = 150;

    this.startAt = Date.now();
  }

  takeDamage( damage ){
    let realDamage = damage;

    if (this.defenseSuccess) {
      realDamage = damage * this.defense;
      this.defenseSuccess = false;
    }

    this.currentLife -= realDamage;

    if (this.currentLife <= 0) {
      this.isDie = true;
    }

    return realDamage;
  }

  attack (target, spell){
    spell.use(target);
  }

  defense () {

  }

  action (arrow, target, direction) {
    if (this.mode == 'attack' && arrow) {
      this.attack(target, this.spells[0])
      this.currentEnergy += 5;
      if (this.currentEnergy > this.maxEnergy) {
        this.currentEnergy = this.maxEnergy;
      }
      arrow.die();
    } else if (this.mode == 'ultra' && this.canAddIncantation) {
      this.incantation.push(direction);
      this.canAddIncantation = false;
      let self = this;
      setTimeout(_ => self.canAddIncantation = true, this.globalCooldown);
    } else if (this.mode == 'defense' && arrow){
      this.defenseSuccess = true;
      this.currentEnergy += 5;
      if (this.currentEnergy > this.maxEnergy) {
        this.currentEnergy = this.maxEnergy;
      }
      arrow.die();
    }
  }
}
