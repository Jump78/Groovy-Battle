import $ from 'jquery';

import upArrowBorderImg from "./assets/img/arrowUpBorder.png";
import rightArrowBorderImg from "./assets/img/arrowRightBorder.png";
import downArrowBorderImg from "./assets/img/arrowDownBorder.png";
import leftArrowBorderImg from "./assets/img/arrowLeftBorder.png";

import Game from './class/Game.class';
import Arrow from './class/Arrow.class';
import ArrowManager from './class/ArrowManager.class';
import Keyboard from './class/Keyboard.class';
import Player from './class/Player.class.js';

const arrowSprite = {upArrowBorderImg, rightArrowBorderImg, downArrowBorderImg, leftArrowBorderImg};
const directions = ['left', 'up', 'down', 'right'];

const GAME = new Game({
  canvas: $('#game')
})

let arrowsBorderP1Generate = directions.map( (direction, index) => {
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
let arrowsBorderP2Generate = directions.map( (direction, index) => {
  return new Arrow({
    direction: direction,
    isDie: false,
    coordinates: {
      x: GAME.canvas.parent().width() - (50*(directions.length-index)),
      y:200
    },
    sprite: arrowSprite[direction+'ArrowBorderImg']
  });
})

let player1 = new Player({
  name: 'Player1',
  keyboard: new Keyboard(),
  arrowManager: new ArrowManager({
    init(){
      let arrowDesti = arrowsBorderP1Generate.filter( arrow => arrow.direction == this.direction)[0];
      this.maxCoordinates.y = arrowDesti.coordinates.y;
      this.coordinates.x = arrowDesti.coordinates.x;
    },
    update(){
      if (this.coordinates.y > this.maxCoordinates.y) {
        this.die();
      }
    }
  }),
  update() {
    let upArrow = this.arrowManager.getArrowIf('up', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let rightArrow = this.arrowManager.getArrowIf('right', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let downArrow = this.arrowManager.getArrowIf('down', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let leftArrow = this.arrowManager.getArrowIf('left', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];

    if (this.keyboard.isDown(this.keyboard.defenseMode)) {
      this.isDefenseMode = true;
    } else {
      this.isDefenseMode = false;
    }

    if (this.keyboard.isDown(this.keyboard.up) && upArrow){
      if (!this.isDefenseMode) {
        player2.currentLife -= 2;
      }
      upArrow.die();
    }

    if (this.keyboard.isDown(this.keyboard.right) && rightArrow){
      if (this.keyboard.isDown(this.keyboard.defenseMode)) {
        this.isDefenseMode = true;
      } else {
        this.isDefenseMode = false;
        player2.currentLife -= 2;
      }
      rightArrow.die();
    }

    if (this.keyboard.isDown(this.keyboard.down) && downArrow){
      if (this.keyboard.isDown(this.keyboard.defenseMode)) {
        this.isDefenseMode = true;
      } else {
        this.isDefenseMode = false;
        player2.currentLife -= 2;
      }
      downArrow.die();
    }

    if (this.keyboard.isDown(this.keyboard.left) && leftArrow){
      if (this.keyboard.isDown(this.keyboard.defenseMode)) {
        this.isDefenseMode = true;
      } else {
        this.isDefenseMode = false;
        player2.currentLife -= 2;
      }
      leftArrow.die();
    }

    let currentTime = Date.now();
    if ( currentTime - this.startAt >= 500) {
      this.startAt = currentTime;
      const direction = ['up', 'right', 'down', 'left'];
      let arrow = this.arrowManager.getArrow(direction[Math.floor(Math.random()*direction.length)], 1)[0]
      arrow.init();
      arrow.velocity.y = 2;
      GAME.scene.push(arrow);
    }
  },
  render(ctx) {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0 , 250*(this.currentLife/this.maxLife), 10);
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(0, 10 , 150*(this.currentEnergy/this.maxEnergy), 10);
    if (this.isDefenseMode == true) {
      ctx.fillStyle = '#F000FF';
      ctx.fillRect(0, 20 , 100, 10);
    }
  }
})
player1.arrowManager.generate({}, 40);

let player2 = new Player({
  name: 'Player2',
  keyboard: new Keyboard({up: 38, right: 39, down: 40, left: 37}),
  arrowManager: new ArrowManager({
    init(){
      let arrowDesti = arrowsBorderP2Generate.filter( arrow => arrow.direction == this.direction)[0];
      this.maxCoordinates.y = arrowDesti.coordinates.y;
      this.coordinates.x = arrowDesti.coordinates.x;
    },
    update(){
      if (this.coordinates.y > this.maxCoordinates.y) {
        this.die();
      }
    }
  }),
  update() {
    let upArrow = this.arrowManager.getArrowIf('up', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let rightArrow = this.arrowManager.getArrowIf('right', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let downArrow = this.arrowManager.getArrowIf('down', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let leftArrow = this.arrowManager.getArrowIf('left', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];

    if (/*this.keyboard.isDown(this.keyboard.up) &&*/ upArrow){
      upArrow.die();
      player1.takeDamage(2);
    }

    if (/*this.keyboard.isDown(this.keyboard.right) &&*/ rightArrow){
      rightArrow.die();
      player1.takeDamage(2);
    }

    if (/*this.keyboard.isDown(this.keyboard.down) &&*/ downArrow){
      downArrow.die();
      player1.takeDamage(2);
    }

    if (/*this.keyboard.isDown(this.keyboard.left) &&*/ leftArrow){
      leftArrow.die();
      player1.takeDamage(2);
    }

    let currentTime = Date.now();
    if ( currentTime - this.startAt >= 500) {
      this.startAt = currentTime;
      const direction = ['up', 'right', 'down', 'left'];
      let arrow = this.arrowManager.getArrow(direction[Math.floor(Math.random()*direction.length)], 1)[0]
      arrow.init();
      arrow.velocity.y = 2;
      GAME.scene.push(arrow);
    }
  },
  render(ctx) {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(GAME.canvas.parent().width(), 0 , -250*(this.currentLife/this.maxLife), 10);
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(GAME.canvas.parent().width(), 10 , -150*(this.currentEnergy/this.maxEnergy), 10);
  }
})
player2.arrowManager.generate({}, 40);

GAME.scene.push(...arrowsBorderP1Generate);
GAME.scene.push(...arrowsBorderP2Generate);
GAME.scene.push(player1);
GAME.scene.push(player2);
GAME.gameloop();
