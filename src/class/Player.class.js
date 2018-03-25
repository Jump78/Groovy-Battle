const defaultFunc = () => {};

export default class {
  constructor( option = {} ) {
    this.name = option.name || 'Noname';
    this.isDie = option.isDie || false;

    this.coordinates = option.coordinates || {x:0, y:0};

    this.scale = option.scale || {x: 1, y: 1};
    this.spritesheet = option.spritesheet || null;
    this.animSpeed = 5;
    this.currentAnimation = 'idle';

    this.hud = option.hud || {};

    this.stats = option.stats || {};

    this.spells = option.spells;

    this.score = option.score || 0;

    this.keyboard = option.keyboard || {};

    this.arrowManager = option.arrowManager || {};

    this.updateCustom = option.update || defaultFunc;
    this.renderCustom = option.render || defaultFunc;
    this.initCustom = option.init || defaultFunc;

    this.mode = 'idle';
    this.defenseSuccess = false;

    this.isUltraMode = false;
    this.incantation = [];

    this.target = option.target || null;

    this.startAt = Date.now();
    this.lastArrowItAt = 0;

    this.currentArrows = [];

    this.arrowHitboxRadius = option.arrowHitboxRadius || 30;
    this.critRange = option.critRange || 3;
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

  attack (target, spell, isCrit){
    spell.use(target, this.stats, isCrit);
  }

  defense () {
    this.defenseSuccess = true;
    this.stats.increase('energy', 5);
  }

  action (arrow, target, direction) {
    if (this.mode == 'attack' && arrow) {
      let isCrit = false;
      if ( arrow.maxCoordinates.y - arrow.getCenter().y < this.critRange
           && arrow.maxCoordinates.y - arrow.getCenter().y > -this.critRange ) {
        isCrit = true;
      }
      this.attack(target, this.spells[0], isCrit)
      this.stats.increase('energy', 5);
      this.currentAnimation = 'attack';
      this.lastArrowItAt = Date.now();
      arrow.die();
    } else if (this.mode == 'ultra') {
      this.incantation.push(direction);
      this.hud.incantation.push(direction);
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

  addArrow(direction) {
    let arrow = this.arrowManager.getArrow(direction, 1)[0];
    arrow.init();
    arrow.velocity.y = 2;
    this.currentArrows.push(arrow);
    this.hud.dynamicArrows.push(arrow);
    return this.currentArrows;
  }

  init() {
    if (this.initCustom) {
      this.initCustom();
    }
  }

  update() {
    if (this.stats.health <= 0) {
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
      this.currentAnimation = 'defense';
    } else if (this.keyboard.isDown(this.keyboard.ultraMode)) {
      this.defenseSuccess = false;
      this.mode = 'ultra';
      this.stats.decrease('energy', 1);
      this.currentAnimation = 'idle';
      if (this.stats.energy <= 0) {
        this.mode = 'attack';
      }
    } else {
      this.defenseSuccess = false;
      this.mode = 'attack';
      this.cast(this.incantation);
      this.incantation = [];
      this.hud.incantation = [];

      if ((this.startAt - this.lastArrowItAt) > 150) {
        this.currentAnimation = 'idle';
      }
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

    const self = this;
    this.currentArrows.forEach( item => {
      item.update();
      if (item.isDie) {
        self.currentArrows.splice(self.currentArrows.indexOf(item), 1)
        self.hud.dynamicArrows.splice(self.hud.dynamicArrows.indexOf(item), 1)
      };
    });

    if (this.updateCustom) {
      this.updateCustom();
    }
  }

  render(ctx) {
    this.spritesheet.play(this.currentAnimation, this.coordinates.x, this.coordinates.y, this.scale, true);

    this.hud.healthBar.width = this.hud.healthBar.baseWidth * (this.stats.health/this.stats.maxHealth);
    this.hud.energyBar.width = this.hud.energyBar.baseWidth * (this.stats.energy/this.stats.maxEnergy);
    this.hud.render(ctx, this.mode);

    if (this.renderCustom) {
      this.renderCustom(ctx);
    }
  }

}
