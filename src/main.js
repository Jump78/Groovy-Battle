import $ from 'jquery';

import upArrowBorderImg from "./assets/img/arrowUpBorder.png";
import rightArrowBorderImg from "./assets/img/arrowRightBorder.png";
import downArrowBorderImg from "./assets/img/arrowDownBorder.png";
import leftArrowBorderImg from "./assets/img/arrowLeftBorder.png";

import guardArrowDown from "./assets/img/guardArrowDown.png";
import guardArrowLeft from "./assets/img/guardArrowLeft.png";
import guardArrowUp from "./assets/img/guardArrowUp.png";
import guardArrowRight from "./assets/img/guardArrowRight.png";

import Game from './class/Game.class';
import Arrow from './class/Arrow.class';
import ArrowManager from './class/ArrowManager.class';
import Keyboard from './class/Keyboard.class';
import Player from './class/Player.class';
import Spell from './class/Spell.class';
import Statistique from './class/Statistique.class';

import data from './data.json';


const arrowSprite = {upArrowBorderImg, rightArrowBorderImg, downArrowBorderImg, leftArrowBorderImg};
const guardArrowSprite = {guardArrowDown, guardArrowLeft, guardArrowUp, guardArrowRight};
const directions = ['left', 'up', 'down', 'right'];

const GAME = new Game({
  canvas: $('#game')
})

let message = '';

let arrowsBorderP1Generate = directions.map( (direction, index) => {
  let sprite = new Image(); // Create new image
  sprite.src = arrowSprite[direction+'ArrowBorderImg']; // Set the image's source

  let guardSprite = new Image(); // Create new image
  guardSprite.src = guardArrowSprite['guardArrow'+direction.replace(direction[0], direction[0].toUpperCase())]; // Set the image's source

  return {
    direction: direction,
    isDie: false,
    coordinates: {
      x:50*(index),
      y:200
    },
    sprite: sprite,
    guardSprite: guardSprite,
    render(ctx){
      if (player1.mode == 'defense') {
        ctx.drawImage(this.guardSprite, this.coordinates.x,this.coordinates.y);
      }
      ctx.drawImage(this.sprite, this.coordinates.x,this.coordinates.y);
    },

    update(){

    },

    getCenter(){
      return {
        x: (this.coordinates.x + (this.coordinates.x + this.sprite.width))/2,
        y: (this.coordinates.y + (this.coordinates.y + this.sprite.height))/2,
      }
    }
  };
})
let arrowsBorderP2Generate = directions.map( (direction, index) => {
  let sprite = new Image(); // Create new image
  sprite.src = arrowSprite[direction+'ArrowBorderImg']; // Set the image's source

  let guardSprite = new Image(); // Create new image
  guardSprite.src = guardArrowSprite['guardArrow'+direction.replace(direction[0], direction[0].toUpperCase())]; // Set the image's source

  return {
    direction: direction,
    isDie: false,
    coordinates: {
      x: GAME.canvas.parent().width() - (50*(directions.length-index)),
      y:200
    },
    sprite: sprite,
    guardSprite: guardSprite,
    render(ctx){
      if (player2.mode == 'defense') {
        ctx.drawImage(this.guardSprite, this.coordinates.x,this.coordinates.y);
      }
      ctx.drawImage(this.sprite, this.coordinates.x,this.coordinates.y);
    },

    update(){

    },

    getCenter(){
      return {
        x: (this.coordinates.x + (this.coordinates.x + this.sprite.width))/2,
        y: (this.coordinates.y + (this.coordinates.y + this.sprite.height))/2,
      }
    }
  };
})

let player1 = new Player({
  name: 'Player1',
  keyboard: new Keyboard(),
  spells: data.spells.map( spell => new Spell(spell)),
  stats: new Statistique(),
  arrowManager: new ArrowManager({
    init(){
      let arrowDesti = arrowsBorderP1Generate.filter( arrow => arrow.direction == this.direction)[0];
      this.maxCoordinates.y = arrowDesti.getCenter().y;
      this.coordinates.x = arrowDesti.coordinates.x;
    },
    update(){
      if (this.coordinates.y > GAME.canvas.height()) {
        this.die();
      }
    }
  }),
  update() {
    if (this.isDie) return;

    let currentTime = Date.now();
    if ( currentTime - this.startAt >= 1000 && this.mode != 'ultra') {
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
    ctx.fillRect(0, 0 , 250*(this.stats.health/this.stats.maxHealth), 10);
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(0, 10 , 150*(this.stats.energy/this.stats.maxEnergy), 10);
  }
})
player1.arrowManager.generate({}, 40);

let player2 = new Player({
  name: 'Player2',
  // isDie: true,
  keyboard: new Keyboard({up: 104, right: 102, down: 101, left: 100, defenseMode:39, ultraMode:13}),
  spells: data.spells.map( spell => new Spell(spell)),
  stats: new Statistique(),
  arrowManager: new ArrowManager({
    init(){
      let arrowDesti = arrowsBorderP2Generate.filter( arrow => arrow.direction == this.direction)[0];
      this.maxCoordinates.y = arrowDesti.getCenter().y;
      this.coordinates.x = arrowDesti.coordinates.x;
    },
    update(){
      if (this.coordinates.y > GAME.canvas.height()) {
        this.die();
      }
    }
  }),
  update() {
    if (this.isDie) return;

    let currentTime = Date.now();
    if ( currentTime - this.startAt >= 1000 && this.mode != 'ultra') {
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
    ctx.fillRect(GAME.canvas.parent().width(), 0 , -250*(this.stats.health/this.stats.maxHealth), 10);
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(GAME.canvas.parent().width(), 10 , -150*(this.stats.energy/this.stats.maxEnergy), 10);
  }
})
player2.arrowManager.generate({}, 40);

player1.target = player2;
player2.target = player1;

GAME.update = () => {
  if (player1.isDie && player2.isDie) {
    message = "Egalité";
  } else if (player1.isDie) {
    message = player2.name + " win";
  } else if (player2.isDie) {
    message = player1.name + " win";
  }
}
GAME.scene.push(...arrowsBorderP1Generate);
GAME.scene.push(...arrowsBorderP2Generate);
GAME.scene.push(player1);
GAME.scene.push(player2);
GAME.scene.push({
  render(ctx) {
    ctx.fillStyle = '#FF0000';
    ctx.font = "60px Impact";
    ctx.textAlign = "center";
    ctx.fillText(message,GAME.canvas.width()/2,GAME.canvas.height()/2);
  },
  update(){}
});
GAME.gameloop();
