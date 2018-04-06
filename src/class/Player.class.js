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
    this.combo = option.combo || 0;

    this.keyboard = option.keyboard || {};

    this.arrowManager = option.arrowManager || {};

    this.updateCustom = option.update || defaultFunc;
    this.renderCustom = option.render || defaultFunc;
    this.initCustom = option.init || defaultFunc;

    this.mode = 'attack';
    this.defenseSuccess = false;

    this.isUltraMode = false;
    this.incantation = [];

    this.target = option.target || null;

    this.startAt = Date.now();
    this.lastArrowItAt = 0;

    this.currentArrows = [];

    this.arrowHitboxRadius = option.arrowHitboxRadius || 30;
    this.critRange = option.critRange || 3;
    this.roundWon = 0;

    this.isStun = false;
    this.StunAt = 0;

    this.eventManager = option.eventManager || {};
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
    spell.use(target, this.stats, isCrit, this.stats.comboMultiplier);
  }

  defense (target, isPerfect = false) {
    this.defenseSuccess = true;
    this.stats.increase('energy', 5);

    if (isPerfect) {
      target.currentAnimation = "stun";
      target.isStun = true;
      target.StunAt = Date.now();
    }
  }

  attackModeAction( arrow, target ) {
    let isCrit = false;
    if ( arrow.maxCoordinates.y - arrow.getCenter().y < this.critRange
         && arrow.maxCoordinates.y - arrow.getCenter().y > -this.critRange ) {
      isCrit = true;
    }
    this.eventManager.add({
      type: 'attack',
      spell : this.spells[0].name,
      isCrit,
    });
  }

  defenseModeAction( arrow, target ) {
    let isPerfect = false;
    if ( arrow.maxCoordinates.y - arrow.getCenter().y < this.critRange
         && arrow.maxCoordinates.y - arrow.getCenter().y > -this.critRange ) {
      isPerfect = true;
    }
    this.eventManager.add({
      type: 'defense',
      spell : null,
      isCrit : isPerfect,
    });
    this.combo++;
    if (!(this.combo%15)) {
      this.stats.increase('comboMultiplier', 0.5)
    }
  }

  receiveAction( message ) {
    // observers.each do |ob|
    //   ob.receiveAction(message)
    // end

    if (message.type == 'attack') {
      const filterFunc = (arrow) => {
        return !arrow.isDie
               && (arrow.maxCoordinates.y - (arrow.coordinates.y + arrow.sprite.height)) < this.arrowHitboxRadius
               && (arrow.maxCoordinates.y - arrow.coordinates.y) >= -this.arrowHitboxRadius
      }

      let arrow = this.currentArrows.filter(filterFunc)[0];
      let spell =  this.spells.filter( item => message.spell == item.name)[0];
      this.attack((spell.self)? this : this.target, spell, message.isCrit);
      if (spell.name == 'Basic attack') {
        this.stats.increase('energy', 5);
        this.currentAnimation = 'attack';
        this.lastArrowItAt = Date.now();
        this.combo++;
      }
      if (!(this.combo%15)) {
        this.stats.increase('comboMultiplier', 0.5)
      }
      arrow.die();
    } else if (message.type == 'defense'){
      const filterFunc = (arrow) => {
        return !arrow.isDie
               && (arrow.maxCoordinates.y - (arrow.coordinates.y + arrow.sprite.height)) < this.arrowHitboxRadius
               && (arrow.maxCoordinates.y - arrow.coordinates.y) >= -this.arrowHitboxRadius
      }

      let arrow = this.currentArrows.filter(filterFunc)[0];
      this.defense(this.target, message.isCrit);
      this.combo++;
      if (!(this.combo%15)) {
        this.stats.increase('comboMultiplier', 0.5)
      }
      arrow.die();
    } else if (message.type == 'changeMode') {
      this.changeMode(message.mode);
    } else if (message.type == 'addArrowIncantation'){
      this.incantation.push(message.direction);
      this.hud.incantation.push(message.direction);
    }
  }

  action (arrow, target, direction) {
    if (this.mode == 'attack' && arrow) {
      this.attackModeAction( arrow, target);
    } else if (this.mode == 'ultra') {
      this.eventManager.add({
        type: 'addArrowIncantation',
        direction : direction
      });
    } else if (this.mode == 'defense' && arrow){
      this.defenseModeAction( arrow, target);
    }
  }

  cast (incantation) {
    if (incantation.length <= 0) return;
    let spell = this.spells.filter( spell => spell.incantation.toString() == incantation.toString())[0];
    if (spell){
      let target = this.target;
      if (spell.self) {
        target = this;
      }
      this.eventManager.add({
        type: 'attack',
        spell : spell.name,
        isCrit : false,
      });
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

  revive () {
    this.stats.reset();
    this.isDie = false;
    this.combo = 0;
  }

  init() {
    if (this.initCustom) {
      this.initCustom();
    }
  }

  changeMode(mode) {
    if (this.mode == mode) return;

    if (mode == 'defense') {
      this.mode = 'defense';
      this.currentAnimation = 'defense';
    }

    if (mode == 'ultra') {
      this.defenseSuccess = false;
      this.mode = 'ultra';
      this.currentAnimation = 'idle';
    }

    if (mode == 'attack') {
      this.incantation = [];
      this.hud.incantation = [];
      this.defenseSuccess = false;
      this.mode = 'attack';
      this.currentAnimation = 'idle';
    }
  }

  update() {
    if (this.stats.health <= 0) {
      this.isDie = true;
    }

    const self = this;
    this.currentArrows.forEach( item => {
      item.update();
      if (item.isDie) {
        self.currentArrows.splice(self.currentArrows.indexOf(item), 1)
        self.hud.dynamicArrows.splice(self.hud.dynamicArrows.indexOf(item), 1)
      };
    });

    if(this.isStun && Date.now() - this.StunAt > 2500) {
      this.isStun = false;
      this.currentAnimation = 'idle';
    }

    if (this.isStun) return;

    const filterFunc = (arrow) => {
      return !arrow.isDie
             && (arrow.maxCoordinates.y - (arrow.coordinates.y + arrow.sprite.height)) < this.arrowHitboxRadius
             && (arrow.maxCoordinates.y - arrow.coordinates.y) >= -this.arrowHitboxRadius
    }

    let upArrow = this.arrowManager.getArrowIf('up', 1, filterFunc)[0];
    let rightArrow = this.arrowManager.getArrowIf('right', 1, filterFunc)[0];
    let downArrow = this.arrowManager.getArrowIf('down', 1, filterFunc)[0];
    let leftArrow = this.arrowManager.getArrowIf('left', 1, filterFunc)[0];

    if (this.mode == 'ultra') {
      //this.stats.decrease('energy', 1);
      if (this.stats.energy <= 0) {
        this.eventManager.add({
          type: 'changeMode',
          mode: 'attack',
        });
      }
    }

    if (this.mode == 'attack' && Date.now() - this.lastArrowItAt > 700) {
      this.currentAnimation = 'idle';
    }

    if (this.keyboard.isDown(this.keyboard.defenseMode)) {
      if (this.mode == 'attack'){
        this.eventManager.add({
          type: 'changeMode',
          mode: 'defense',
        });
      }
    } else if (this.stats.energy > 0 && this.keyboard.isDown(this.keyboard.ultraMode)) {
      if (this.mode == 'attack') {
        this.eventManager.add({
          type: 'changeMode',
          mode: 'ultra',
        });
      }
    }

    if (this.keyboard.isUp(this.keyboard.defenseMode)) {
      this.eventManager.add({
        type: 'changeMode',
        mode: 'attack',
      });

      this.keyboard.removeFromUnpressed(this.keyboard.defenseMode);
    }

    if (this.keyboard.isUp(this.keyboard.ultraMode)) {
      this.cast(this.incantation);
      this.eventManager.add({
        type: 'changeMode',
        mode: 'attack',
      });

      this.keyboard.removeFromUnpressed(this.keyboard.ultraMode);
    }

    if (this.keyboard.isDown(this.keyboard.up)){
      this.action(upArrow, this.target, 'up');
      this.keyboard.removeFromPressed(this.keyboard.up)
    }

    if (this.keyboard.isDown(this.keyboard.right)){
      this.action(rightArrow, this.target, 'right');
      this.keyboard.removeFromPressed(this.keyboard.right)
    }

    if (this.keyboard.isDown(this.keyboard.down)){
      this.action(downArrow, this.target, 'down');
      this.keyboard.removeFromPressed(this.keyboard.down)
    }

    if (this.keyboard.isDown(this.keyboard.left)){
      this.action(leftArrow, this.target, 'left');
      this.keyboard.removeFromPressed(this.keyboard.left)
    }

    if (this.updateCustom) {
      this.updateCustom();
    }
  }

  render(ctx) {
    this.spritesheet.play(this.currentAnimation, this.coordinates.x, this.coordinates.y, this.scale, true);

    this.hud.healthBar.width = this.hud.healthBar.baseWidth * (this.stats.health/this.stats.maxHealth);
    this.hud.energyBar.width = this.hud.energyBar.baseWidth * (this.stats.energy/this.stats.maxEnergy);
    this.hud.combo.value = this.combo;
    this.hud.render(ctx, this.mode);

    if (this.renderCustom) {
      this.renderCustom(ctx);
    }
  }
}
