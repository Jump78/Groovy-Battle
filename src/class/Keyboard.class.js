import $ from 'jquery';

/**
 * Keyboard class
 *
 * @type Keyboard
 */
export default class {
  constructor( option = {} ) {
    this.pressed = {};

    this.up = option.up || 90;
    this.right = option.right || 68;
    this.down = option.down || 83;
    this.left = option.left || 81;

    $('body').on('keydown', (e) => {
      this.pressed[e.keyCode] = true;
    });

    $('body').on('keyup', (e) => {
      delete this.pressed[e.keyCode];
    });
  }

  isDown (keyCode) {
    return this.pressed[keyCode];
  }
}
