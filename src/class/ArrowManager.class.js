import upArrowImg from "../assets/img/arrowUp.png";
import rightArrowImg from "../assets/img/arrowRight.png";
import downArrowImg from "../assets/img/arrowDown.png";
import leftArrowImg from "../assets/img/arrowLeft.png";

import Arrow from './Arrow.class';

export default class {
  constructor(option) {
    this.option = option;
    this.upArrowPool = [];
    this.rightArrowPool = [];
    this.downArrowPool = [];
    this.leftArrowPool = [];
  }

  generate( option, number ){
    const directions = ['up', 'right', 'down', 'left'];
    const arrowSprite = {upArrowImg, rightArrowImg, downArrowImg, leftArrowImg};
    let newArrows = [];

    for (var i = 0; i < number; i++) {
      let directionTest = option.direction || directions[i%directions.length];

      let arrowOption = {
        direction: directionTest,
        coordinates: {
          x:0,
          y:0
        },
        sprite: arrowSprite[directionTest+'ArrowImg'],
        isDie: true
      }

      let newArrow = new Arrow(Object.assign(arrowOption, this.option, option));
      this[directionTest+'ArrowPool'].push(newArrow);
      newArrows.push(newArrow);
    }
    return newArrows;
  }

  getArrow( direction, number ){
    let arrows = this[direction+'ArrowPool'].filter( (arrow, index) => arrow.isDie);
    
    if (arrows.length < number) {
      let arrowGenerate = this.generate( {direction}, number - arrows.length);
      arrows = arrows.concat(arrowGenerate);
    }

    return arrows.slice(0, number);
  }
}
