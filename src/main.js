import $ from 'jquery';

import upArrowBorderImg from "./assets/img/arrowUpBorder.png";
import rightArrowBorderImg from "./assets/img/arrowRightBorder.png";
import downArrowBorderImg from "./assets/img/arrowDownBorder.png";
import leftArrowBorderImg from "./assets/img/arrowLeftBorder.png";

import Game from './class/Game.class';
import Arrow from './class/Arrow.class';
import ArrowManager from './class/ArrowManager.class';
import Keyboard from './class/Keyboard.class';
import Player from './class/Player.class';
import Spell from './class/Spell.class';

import data from './data.json';


const arrowSprite = {upArrowBorderImg, rightArrowBorderImg, downArrowBorderImg, leftArrowBorderImg};
const directions = ['left', 'up', 'down', 'right'];

const GAME = new Game({
  canvas: $('#game')
})

var message = '';

let arrowsBorderP1Generate = directions.map( (direction, index) => {
  return new Arrow({
    direction: direction,
    isDie: false,
    coordinates: {
      x:50*(index),
      y:200
    },
    sprite: arrowSprite[direction+'ArrowBorderImg'],
    render(ctx){
      ctx.beginPath();
      ctx.arc((this.coordinates.x+(this.coordinates.x+this.sprite.width))/2,
              (this.coordinates.y+(this.coordinates.y+this.sprite.height))/2,
              player1.arrowHitboxRadius,
              0,
              Math.PI*2,
              true
            );
      ctx.fill();
      ctx.closePath();
    }
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
  spells: data.spells.map( spell => new Spell(spell)),
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
    if (this.isDie) {
      message = "Player 2 win";
      return;
    }

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
    ctx.fillRect(0, 0 , 250*(this.currentLife/this.maxLife), 10);
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(0, 10 , 150*(this.currentEnergy/this.maxEnergy), 10);
    if (this.mode == 'defense') {
      ctx.fillStyle = '#F000FF';
      ctx.fillRect(0, 20 , 100, 10);
    }
  }
})
player1.arrowManager.generate({}, 40);

let player2 = new Player({
  name: 'Player2',
  isDie: true,
  keyboard: new Keyboard({up: 104, right: 102, down: 101, left: 100, defenseMode:39, ultraMode:13}),
  spells: data.spells.map( spell => new Spell(spell)),
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
    if (this.currentLife <= 0) {
      this.isDie = true;
      message = "Player 1 win";
      return;
    }

    let upArrow = this.arrowManager.getArrowIf('up', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let rightArrow = this.arrowManager.getArrowIf('right', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let downArrow = this.arrowManager.getArrowIf('down', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];
    let leftArrow = this.arrowManager.getArrowIf('left', 1, (arrow) => !arrow.isDie && (arrow.maxCoordinates.y - arrow.coordinates.y) < 15 )[0];

    if (this.keyboard.isDown(this.keyboard.defenseMode)) {
      this.mode = 'defense';
    } else if (this.keyboard.isDown(this.keyboard.ultraMode)) {
      this.mode = 'ultra';
      this.currentEnergy -= 1;
      if (this.currentEnergy <= 0) {
        this.mode = 'attack';
      }
    } else {
      let spell = this.spells.filter( spell => spell.incantation.toString() == this.incantation.toString())[0];
      if (this.incantation.length > 0 && spell){
        if (spell.self) {
          this.attack(this, spell);
        } else {
          this.attack(player1, spell);
        }
        this.canAddIncantation = true;
      }
      this.incantation = [];
      this.mode = 'attack';
    }

    if (this.keyboard.isDown(this.keyboard.up)){
      if (this.mode == 'attack' && upArrow) {
        player1.takeDamage(2);
        this.currentEnergy += 5;
        if (this.currentEnergy > this.maxEnergy) {
          this.currentEnergy = this.maxEnergy;
        }
        upArrow.die();
      } else if (this.mode == 'ultra' && this.canAddIncantation) {
        this.incantation.push('up');
        this.canAddIncantation = false;
        let self = this;
        setTimeout(_ => self.canAddIncantation = true, this.globalCooldown);
      } else if (this.mode == 'defense' && upArrow){
        this.defenseSuccess = true;
        this.currentEnergy += 5;
        if (this.currentEnergy > this.maxEnergy) {
          this.currentEnergy = this.maxEnergy;
        }
        upArrow.die();
      }
    }

    if (this.keyboard.isDown(this.keyboard.right)){
      if (this.mode == 'attack' && rightArrow) {
        player1.takeDamage(2);
        this.currentEnergy += 5;
        if (this.currentEnergy > this.maxEnergy) {
          this.currentEnergy = this.maxEnergy;
        }
        rightArrow.die();
      } else if (this.mode == 'ultra' && this.canAddIncantation) {
        this.incantation.push('right');
        this.canAddIncantation = false;
        let self = this;
        setTimeout(_ => self.canAddIncantation = true, this.globalCooldown);
      } else if (this.mode == 'defense' && rightArrow){
        this.defenseSuccess = true;
        this.currentEnergy += 5;
        if (this.currentEnergy > this.maxEnergy) {
          this.currentEnergy = this.maxEnergy;
        }
        rightArrow.die();
      }
    }

    if (this.keyboard.isDown(this.keyboard.down)){
      if (this.mode == 'attack' && downArrow) {
        player1.takeDamage(2);
        this.currentEnergy += 5;
        if (this.currentEnergy > this.maxEnergy) {
          this.currentEnergy = this.maxEnergy;
        }
        downArrow.die();
      } else if (this.mode == 'ultra' && this.canAddIncantation) {
        this.incantation.push('down');
        this.canAddIncantation = false;
        let self = this;
        setTimeout(_ => self.canAddIncantation = true, this.globalCooldown);
      } else if (this.mode == 'defense' && downArrow){
        this.defenseSuccess = true;
        this.currentEnergy += 5;
        if (this.currentEnergy > this.maxEnergy) {
          this.currentEnergy = this.maxEnergy;
        }
        downArrow.die();
      }
    }

    if (this.keyboard.isDown(this.keyboard.left)){
      if (this.mode == 'attack' && leftArrow) {
        player1.takeDamage(2);
        this.currentEnergy += 5;
        if (this.currentEnergy > this.maxEnergy) {
          this.currentEnergy = this.maxEnergy;
        }
        leftArrow.die();
      } else if (this.mode == 'ultra' && this.canAddIncantation) {
        this.incantation.push('left');
        this.canAddIncantation = false;
        let self = this;
        setTimeout(_ => self.canAddIncantation = true, this.globalCooldown);
      } else if (this.mode == 'defense' && leftArrow){
        this.defenseSuccess = true;
        this.currentEnergy += 5;
        if (this.currentEnergy > this.maxEnergy) {
          this.currentEnergy = this.maxEnergy;
        }
        leftArrow.die();
      }
    }

    let currentTime = Date.now();
    if ( currentTime - this.startAt >= 500 && !this.isUltraMode) {
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
    if (this.mode == 'defense') {
      ctx.fillStyle = '#F000FF';
      ctx.fillRect(GAME.canvas.parent().width(), 20 , -100, 10);
    }
  }
})
player2.arrowManager.generate({}, 40);

player1.target = player2;


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
