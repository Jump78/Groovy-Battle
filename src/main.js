import $ from 'jquery';

import upArrowBorderImg from "./assets/img/arrowUpBorder.png";
import rightArrowBorderImg from "./assets/img/arrowRightBorder.png";
import downArrowBorderImg from "./assets/img/arrowDownBorder.png";
import leftArrowBorderImg from "./assets/img/arrowLeftBorder.png";

import Game from './class/Game.class';
import Arrow from './class/Arrow.class';
import ArrowManager from './class/ArrowManager.class';


const arrowSprite = {upArrowBorderImg, rightArrowBorderImg, downArrowBorderImg, leftArrowBorderImg};
const directions = ['up', 'right', 'down', 'left'];

let arrowsBorderGenerate = directions.map( (direction, index) => {
  return new Arrow({
    direction: direction,
    isDie: false,
    coordinates: {
      x:50*(index),
      y:200
    },
    sprite: arrowSprite[direction+'ArrowBorderImg']
  });
})

let ui = new ArrowManager({
  init(){
    let arrowDesti = arrowsBorderGenerate.filter( arrow => arrow.direction == this.direction)[0];
    this.coordinates.x = arrowDesti.coordinates.x;
  },
  update(){
    let arrowDesti = arrowsBorderGenerate.filter( arrow => arrow.direction == this.direction)[0];
    if (this.coordinates.y > arrowDesti.coordinates.y) {
      this.die();
    }
  }
});

ui.generate({}, 20);

const GAME = new Game({
  canvas: $('#game'),
  arrowManager: ui
})

GAME.scene.push(...arrowsBorderGenerate);
GAME.gameloop();
