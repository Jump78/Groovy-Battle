const defaultFunc = () => {};

export default class {
  constructor( option = {} ) {
    this.name = option.name || 'Noname';
    this.isDie = option.isDie || false;

    this.stats = option.stats || {};

    this.spells = option.spells;

    this.score = option.score || 0;

    this.keyboard = option.keyboard || {};

    this.arrowManager = option.arrowManager || {};

    this.updateCustom = option.update || defaultFunc;
    this.render = option.render || defaultFunc;

    this.mode = 'attack';
    this.defenseSuccess = false;

    this.isUltraMode = false;
    this.incantation = [];

    this.target = option.target || null;

    this.startAt = Date.now();

    this.arrowHitboxRadius = option.arrowHitboxRadius || 30;
  }

  takeDamage( damage ){
    let realDamage = damage;

    if (this.defenseSuccess) {
      realDamage = damage / this.stats.defense;
      this.defenseSuccess = false;
    }

    this.stats.health -= realDamage;

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
    this.stats.increase('energy', 5);
  }

  action (arrow, target, direction) {
    if (this.mode == 'attack' && arrow) {
      this.attack(target, this.spells[0])
      this.stats.increase('energy', 5);
      arrow.die();
    } else if (this.mode == 'ultra') {
      this.incantation.push(direction);
    } else if (this.mode == 'defense' && arrow){
      this.defense();
      arrow.die();
    }
  }

  cast (incantation) {
    if (incantation.length <= 0) return;
    let spell = this.spells.filter( spell => spell.incantation.toString() == incantation.toString())[0];
    if (spell){
      if (spell.self) {
        this.attack(this, spell);
      } else {
        this.attack(this.target, spell);
      }
    }
    return false
  }

  update() {
    if (this.currentLife <= 0) {
      this.isDie = true;
    }

    const filterFunc = (arrow) => {
      return !arrow.isDie
             && (arrow.maxCoordinates.y - (arrow.coordinates.y + arrow.sprite.height)) < this.arrowHitboxRadius
             && (arrow.maxCoordinates.y - arrow.coordinates.y) >= -this.arrowHitboxRadius
    }

    let upArrow = this.arrowManager.getArrowIf('up', 1, filterFunc)[0];
    let rightArrow = this.arrowManager.getArrowIf('right', 1, filterFunc)[0];
    let downArrow = this.arrowManager.getArrowIf('down', 1, filterFunc)[0];
    let leftArrow = this.arrowManager.getArrowIf('left', 1, filterFunc)[0];

    if (this.keyboard.isDown(this.keyboard.defenseMode)) {
      this.mode = 'defense';
    } else if (this.keyboard.isDown(this.keyboard.ultraMode)) {
      this.mode = 'ultra';
      this.stats.decrease('energy', 1);
      if (this.stats.energy <= 0) {
        this.mode = 'attack';
      }
    } else {
      this.mode = 'attack';
      this.cast(this.incantation);
      this.incantation = [];
    }

    if (this.keyboard.isDown(this.keyboard.up)){
      this.action(upArrow, this.target, 'up');
      this.keyboard.remove(this.keyboard.up)
    }

    if (this.keyboard.isDown(this.keyboard.right)){
      this.action(rightArrow, this.target, 'right');
      this.keyboard.remove(this.keyboard.right)
    }

    if (this.keyboard.isDown(this.keyboard.down)){
      this.action(downArrow, this.target, 'down');
      this.keyboard.remove(this.keyboard.down)
    }

    if (this.keyboard.isDown(this.keyboard.left)){
      this.action(leftArrow, this.target, 'left');
      this.keyboard.remove(this.keyboard.left)
    }

    if (this.updateCustom) {
      this.updateCustom();
    }
  }
}
