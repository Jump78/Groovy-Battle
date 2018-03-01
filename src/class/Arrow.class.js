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
    this.initOption = option.init || null;
  }

  die() {
    this.isDie = true;
  }

  render(ctx){
    ctx.drawImage(this.sprite, this.coordinates.x,this.coordinates.y)
  }

  init() {
    this.isDie = false;
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
    this.coordinates.y += this.velocity.y;
    if (this.updateOption) {
      this.updateOption();
    }
  }
}