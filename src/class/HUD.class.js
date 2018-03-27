export default class {
  constructor (option = {}) {
    this.coordinates = option.coordinates || {x: 0, y:0};

    this.healthBar = option.healthBar || {
      x: 0,
      y: 0,
      width: 250,
      baseWidth: 250,
      height: 10,
      baseHeight: 10,
      color: '#FF0000'
    };

    this.energyBar = option.energyBar || {
      x: 0,
      y: 10,
      width: 150,
      baseWidth: 150,
      height: 10,
      baseHeight: 10,
      color: '#0000FF'
    };

    this.arrowLimit = option.arrowLimit || {
      x: 0,
      y: 200
    }

    this.arrows = option.arrows || [];
    this.arrowsGuard = option.arrowsGuard || [];
    this.arrowsSpritePull = option.arrowsSpritePull || [];
    this.dynamicArrows = [];

    this.ultraModeBackground = option.ultraModeBackground || {};
    this.incantation = [];

    this.combo = option.combo || {
      coordinates: {
        x: 0,
        y:0
      },
      color: '#000000',
      font: "30px Arial",
      textAlign: "start",
      value: 0
    };

    this.scale = option.scale || {x: 1, y: 1};
  }

  render (ctx, mode) {
    ctx.save();
    ctx.translate(this.coordinates.x, this.coordinates.y);
    ctx.scale(this.scale.x, this.scale.y);
    ctx.fillStyle = this.healthBar.color;
    ctx.fillRect(this.healthBar.x, this.healthBar.y, this.healthBar.width, this.healthBar.height);

    ctx.fillStyle = this.energyBar.color;
    ctx.fillRect(this.energyBar.x, this.energyBar.y, this.energyBar.width, this.energyBar.height);

    ctx.fillStyle = this.combo.color;
    ctx.font = this.combo.font;
    ctx.fillText(this.combo.value, this.combo.x, this.combo.y);

    if (mode == 'ultra') {
      this.ultraModeBackground.render(ctx);

      this.incantation.forEach( (direction, index) => {
        let arrow = this.arrowsSpritePull.filter( arrow => direction == arrow.direction)[0];
        arrow.coordinates.x = index*50;
        arrow.coordinates.y = 50;
        arrow.render(ctx);
      });
    } else {
      ctx.scale(this.scale.x, this.scale.y);
      if (mode == 'defense') {
        this.arrowsGuard.forEach( arrow => arrow.render(ctx));
      }
      this.arrows.forEach( arrow => {
        arrow.render(ctx)
      });
    }

    this.dynamicArrows.forEach( item => {
      item.render(ctx);
    });

    ctx.restore();
  }
}
