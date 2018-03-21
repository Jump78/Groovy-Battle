export default class {
  constructor (option = {}) {
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

    this.scale = option.scale || 1;
  }

  render (ctx) {
    ctx.fillStyle = this.healthBar.color;
    ctx.fillRect(this.healthBar.x, this.healthBar.y, this.healthBar.width * this.scale, this.healthBar.height);
    ctx.fillStyle = this.energyBar.color;
    ctx.fillRect(this.energyBar.x, this.energyBar.y, this.energyBar.width * this.scale, this.energyBar.height);
  }
}
