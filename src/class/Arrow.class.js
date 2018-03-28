import upArrowImg from "../assets/img/arrowUp.png";

/**
 * Arrow class
 *
 * @type Arrow
 */
export default class {
  constructor( option ) {
    this.option = option;
    this.isDie = (option.isDie)? true :false;
    this.direction = option.direction || 'up'; // Arrow direction
    this.lifetime = option.lifetime || 0;
    this.alpha = 1;
    this.fade = false;
    this.coordinates = {
        x: option.coordinates.x || 0, // X coordinate
        y: option.coordinates.y || 0  // Y coordinate
    };

    this.maxCoordinates = {
      x: Infinity,
      y: Infinity
    }

    this.velocity = {
      x: 0,
      y: 0
    }

    if (option.velocity) {
      this.velocity = {
        x: option.velocity.x || 0,
        y: option.velocity.y || 0
      }
    }

    this.sprite = new Image(); // Create new image
    this.sprite.src = option.sprite || upArrowImg; // Set the image's source

    this.updateOption = option.update || null;
    this.renderOption = option.render || null;
    this.initOption = option.init || null;
  }

  die() {
    this.isDie = true;
  }

  getCenter(){
    return {
      x: (this.coordinates.x + (this.coordinates.x + this.sprite.width))/2,
      y: (this.coordinates.y + (this.coordinates.y + this.sprite.height))/2,
    }
  }

  render(ctx){
    if (this.renderOption) {
      this.renderOption(ctx);
    }
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.sprite, this.coordinates.x,this.coordinates.y);
  }

  init() {
    this.isDie = false;
    this.alpha = 1;
    this.fade = false;
    this.coordinates.y = this.option.coordinates.y || 0;
    if (this.option.velocity) {
      this.velocity = {
        x: this.option.velocity.x || 0,
        y: this.option.velocity.y || 0
      }
    } else {
      this.velocity = {
        x: 0,
        y: 0
      }
    }
    if (this.initOption) {
      this.initOption();
    }
  }

  update() {
    if (this.isDie) return;

    this.coordinates.y += this.velocity.y;
    if (this.fade) this.alpha-= 0.1;

    if (this.alpha <= 0) this.isDie = true;
    if (this.updateOption) {
      this.updateOption();
    }
  }
}
