import $ from 'jquery';

import upArrowBorderImg from "./assets/img/arrowUpBorder.png";
import rightArrowBorderImg from "./assets/img/arrowRightBorder.png";
import downArrowBorderImg from "./assets/img/arrowDownBorder.png";
import leftArrowBorderImg from "./assets/img/arrowLeftBorder.png";

import guardArrowDown from "./assets/img/guardArrowDown.png";
import guardArrowLeft from "./assets/img/guardArrowLeft.png";
import guardArrowUp from "./assets/img/guardArrowUp.png";
import guardArrowRight from "./assets/img/guardArrowRight.png";

import ultraModeImage from "./assets/img/ultraMode.png";
import background from "./assets/img/background.jpg";

import playerSpritesheetImg from "./assets/img/warrior-sprite-sheet.png";
import playerSpritesheetJson from "./assets/img/warrior-sprite-sheet.json";

import Game from './class/Game.class';
import Arrow from './class/Arrow.class';
import ArrowManager from './class/ArrowManager.class';
import Keyboard from './class/Keyboard.class';
import Player from './class/Player.class';
import Spell from './class/Spell.class';
import Statistique from './class/Statistique.class';
import Audio from './class/Audio.class';
import Tileset from './class/Tileset.class';
import HUD from './class/HUD.class';

import data from './data.json';
import song from './assets/song/UnexpectedVibes.mp3';
import pure from './assets/song/signal_pure.mp3';

let audioAnalyser = new Audio();

audioAnalyser.loadSound({battleSong: song, pure});

const arrowSprite = {upArrowBorderImg, rightArrowBorderImg, downArrowBorderImg, leftArrowBorderImg};
const guardArrowSprite = {guardArrowDown, guardArrowLeft, guardArrowUp, guardArrowRight};
const directions = ['left', 'up', 'down', 'right'];

const ultraModeSprite = new Image();
ultraModeSprite.src = ultraModeImage;

const backgroundSprite = new Image();
backgroundSprite.src = background;

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

      if (player1.mode != 'ultra') {
        ctx.drawImage(this.sprite, this.coordinates.x,this.coordinates.y);
      }
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

let test = 0;
let player1 = new Player({
  name: 'Player1',
  coordinates: {
    x: 300,
    y: 300
  },
  keyboard: new Keyboard(),
  spells: data.spells.map( spell => new Spell(spell)),
  stats: new Statistique(),
  scale: {x:-1.5, y:1.5},
  hud: new HUD({
    healthBar:{
      x: 20,
      y: 10,
      width: 250,
      baseWidth: 250,
      height: 10,
      baseHeight: 10,
      color: '#FF0000'
    },
    energyBar:{
      x: 20,
      y: 20,
      width: 150,
      baseWidth: 150,
      height: 10,
      baseHeight: 10,
      color: '#0000FF'
    }
  }),
  spritesheet: new Tileset(GAME.context, playerSpritesheetImg, playerSpritesheetJson, 5),
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
    // if (test < 250) {
    //   console.log(test);
    // }
    // if (audioAnalyser.playingSource.indexOf('battleSong') >= 0 && (test == 250 || test == 500 || test == 1000 || test == 2500 || test == 5000)) {
    //   let a = audioAnalyser.getByteFrequencyData();
    //   console.log('-------' +test+ '------');
    //   console.log(a);
    //   console.log(a.sort((a, b) => b.frequency - a.frequency))
    // }
    // test++;

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
  render (ctx) {
    if (this.mode == 'ultra') {
      ctx.drawImage(ultraModeSprite, 0, 50);

      this.incantation.forEach( (direction, index) => {
        let arrow = arrowsBorderP1Generate.filter( arrow => direction == arrow.direction)[0];
        ctx.drawImage(arrow.sprite, index*50, 50);
      });
    }
  }
})
player1.arrowManager.generate({}, 40);

let player2 = new Player({
  name: 'Player2',
  // isDie: true,
  coordinates: {
    x: GAME.canvas.parent().width() - 700,
    y: 300
  },
  keyboard: new Keyboard({up: 73, right: 76, down: 75, left: 74, defenseMode:223, ultraMode:188}),
  spells: data.spells.map( spell => new Spell(spell)),
  stats: new Statistique(),
  scale: {x:1.5, y:1.5},
  hud: new HUD({
    scale: -1,
    healthBar:{
      x: GAME.canvas.parent().width() - 20,
      y: 10,
      width: 250,
      baseWidth: 250,
      height: 10,
      baseHeight: 10,
      color: '#FF0000'
    },
    energyBar:{
      x: GAME.canvas.parent().width()-20,
      y: 20,
      width: 150,
      baseWidth: 150,
      height: 10,
      baseHeight: 10,
      color: '#0000FF'
    }
  }),
  spritesheet: new Tileset(GAME.context, playerSpritesheetImg, playerSpritesheetJson, 5),
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
  render (ctx) {
    if (this.mode == 'ultra') {
      ctx.drawImage(ultraModeSprite, GAME.canvas.parent().width(), 50, -ultraModeSprite.width, ultraModeSprite.height);

      this.incantation.forEach( (direction, index) => {
        let arrow = arrowsBorderP2Generate.filter( arrow => direction == arrow.direction)[0];
        ctx.drawImage(arrow.sprite, GAME.canvas.parent().width() - (50*(this.incantation.length-index)) , 50);
      });
    }
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

  if (audioAnalyser.bufferLoader.isAllLoaded()) {
    audioAnalyser.playSound('battleSong');
  }
}

GAME.scene.push({
  render(ctx) {
    ctx.drawImage(backgroundSprite, 0, 0, GAME.canvas.width(), GAME.canvas.height());
  },
  update(){}
});
GAME.scene.push({
  render(ctx) {
    ctx.fillStyle = '#FF0000';
    ctx.font = "60px Impact";
    ctx.textAlign = "center";
    ctx.fillText(message,GAME.canvas.width()/2,GAME.canvas.height()/2);
  },
  update(){}
});
GAME.scene.push(...arrowsBorderP1Generate);
GAME.scene.push(...arrowsBorderP2Generate);
GAME.scene.push(player1);
GAME.scene.push(player2);
GAME.gameloop();
