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

    this.updateCustom = option.update || defaultFunc;
    this.render = option.render || defaultFunc;

    this.mode = 'attack';
    this.defenseStat = 4;
    this.defenseSuccess = false;

    this.isUltraMode = false;
    this.incantation = [];
    this.canAddIncantation = true;

    this.globalCooldown = 150;

    this.target = option.target || null;

    this.startAt = Date.now();
  }

  takeDamage( damage ){
    let realDamage = damage;

    if (this.defenseSuccess) {
      realDamage = damage / this.defenseStat;
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
    this.defenseSuccess = true;
    this.currentEnergy += 5;
    if (this.currentEnergy > this.maxEnergy) {
      this.currentEnergy = this.maxEnergy;
    }
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
      this.defense();
      arrow.die();
    }
  }

  checkIncantation (incantation) {
    let spell = this.spells.filter( spell => spell.incantation.toString() == this.incantation.toString())[0];
    if (this.incantation.length > 0 && spell){
      return true;
    }
    return false
  }

  update() {
    if (this.currentLife <= 0) {
      this.isDie = true;
    }

    let upArrow = this.arrowManager.getArrowIf('up', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let rightArrow = this.arrowManager.getArrowIf('right', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let downArrow = this.arrowManager.getArrowIf('down', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let leftArrow = this.arrowManager.getArrowIf('left', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];

    if (this.keyboard.isDown(this.keyboard.defenseMode)) {
      this.mode = 'defense';
    } else if (this.keyboard.isDown(this.keyboard.ultraMode)) {
      this.mode = 'ultra';
      this.currentEnergy -= 1;
      if (this.currentEnergy <= 0) {
        this.mode = 'attack';
      }
    } else {
      if (this.checkIncantation()){
        if (spell.self) {
          this.attack(this, spell);
        } else {
          this.attack(this.target, spell);
        }
      };
      this.canAddIncantation = true;
      this.incantation = [];
      this.mode = 'attack';
    }

    if (this.keyboard.isDown(this.keyboard.up)){
      this.action(upArrow, this.target, 'up');
    }

    if (this.keyboard.isDown(this.keyboard.right)){
      this.action(rightArrow, this.target, 'right');
    }

    if (this.keyboard.isDown(this.keyboard.down)){
      this.action(downArrow, this.target, 'down');
    }

    if (this.keyboard.isDown(this.keyboard.left)){
      this.action(leftArrow, this.target, 'left');
    }

    if (this.updateCustom) {
      this.updateCustom();
    }
  }
}
