import $ from 'jquery';

const defaultFunc = () => {};

export default class {
  constructor( option ) {
    //Canvas
    this.canvas = option.canvas;
    this.context = this.canvas[0].getContext('2d');

    //Set canvas Size
    this.canvas.attr('width', this.canvas.parent().width());
    this.canvas.attr('height', this.canvas.parent().height());

    //Scene
    this.scene = option.scene || [];

    this.initCustom = option.init || defaultFunc;
    this.update = option.update || defaultFunc;

    this.startAt = Date.now();
    this.lastArrowAt = Date.now();

    this.isRoundFinished = false;

    this.online = option.online || false;

    this.init();
  }

  /**
   * Reset players after 5 sec
   * @param {player} player1  A player
   * @param {player} player2  Second player
   */
  resetRound (player1, player2) {
    const self = this;
    setTimeout(function(){
      self.isRoundFinished = false; // Allow the game to run another round
      player1.revive(); // Reset the player
      player2.revive();
    }, 5000)
  }

  init () {
    this.initCustom();
  }

  gameloop () {
    this.context.clearRect(0, 0, this.canvas.width(), this.canvas.height());

    let self = this;
    this.scene.forEach( item => {
      this.context.save();
      item.render(this.context);
      this.context.restore();
      item.update();
      //if (item.isDie) self.scene.splice(self.scene.indexOf(item), 1)
    })

    this.update();

    requestAnimationFrame(this.gameloop.bind(this));
  }
}
