import upArrowImg from "../assets/img/arrowUp.png";

/**
 * Arrow class
 *
 * @type Arrow
 */
export default class {
  constructor( option ) {
    this.option = option;
    this.isDie = false;
    this.direction = option.direction || 'up'; // Arrow direction
    this.lifetime = option.lifetime || 0;
    this.coordinates = {
        x: option.coordinates.x || 0, // X coordinate
        y: option.coordinates.y || 0  // Y coordinate
    };

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
    this.sprite.src = option.sprite || upArrowImg; // Set the image's sourc
  }

  die() {
    this.isDie = true;
    this.constructor(this.option);
  }

  render(ctx){
    ctx.drawImage(this.sprite, this.coordinates.x,this.coordinates.y)
  }

  update() {
  }
}
