
export default class {
  constructor (option = {}) {
    this.coordinates = this.option.coordinates || {x: 0, y:0};

    this.img = new Image(); // Create new image
    this.img.src = option.img; // Set the image's source
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
