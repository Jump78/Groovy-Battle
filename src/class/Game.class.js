import $ from 'jquery';

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

    this.arrowsPull = option.arrowsPull || []

    this.arrowManager = option.arrowManager || {};

    this.startAt = Date.now();
  }

  gameloop () {
    this.context.clearRect(0, 0, this.canvas.width(), this.canvas.height());
    // let currentTime = Date.now();
    //
    // if ( currentTime - this.startAt >= 500) {
    //   this.startAt = currentTime;
    //   const direction = ['up', 'right', 'down', 'left'];
    //   let arrow = this.arrowManager.getArrow(direction[Math.floor(Math.random()*direction.length)], 1)[0]
    //   arrow.init();
    //   arrow.velocity.y = 2;
    //   this.scene.push(arrow);
    // }

    let self = this;
    this.scene.forEach( item => {
      item.render(this.context);
      item.update();
      if (item.isDie) self.scene.splice(self.scene.indexOf(item), 1)
    })

    requestAnimationFrame(this.gameloop.bind(this));
  }
}
