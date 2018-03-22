
export default class {
  constructor (option = {}) {
    this.coordinates = option.coordinates || {x: 0, y:0};
    this.isDie = option.isDie || false;

    this.img = new Image(); // Create new image
    this.img.src = option.img; // Set the image's source
  }

  getCenter(){
    return {
      x: (this.coordinates.x + (this.coordinates.x + this.img.width))/2,
      y: (this.coordinates.y + (this.coordinates.y + this.img.height))/2,
    }
  }

  update () {

  }

  render (ctx) {
    if (this.renderOption) {
      this.renderOption(ctx);
    }
    ctx.drawImage(this.img, this.coordinates.x,this.coordinates.y);
  }
}
