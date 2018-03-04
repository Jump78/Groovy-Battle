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

  attack (target, attackObject){
    attackObject.use(target);
  }
}
