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
import Sprite from './class/Sprite.class';

import data from './data.json';
import song from './assets/song/UnexpectedVibes.mp3';
import pure from './assets/song/signal_pure.mp3';

let audioAnalyser = new Audio();

audioAnalyser.loadSound({battleSong: song, pure});

const arrowSprite = {upArrowBorderImg, rightArrowBorderImg, downArrowBorderImg, leftArrowBorderImg};
const guardArrowSprite = {guardArrowDown, guardArrowLeft, guardArrowUp, guardArrowRight};
const directions = ['left', 'up', 'down', 'right'];

const backgroundSprite = new Image();
backgroundSprite.src = background;

const GAME = new Game({
  canvas: $('#game')
})

let message = '';

let test = 0;
let player1 = new Player({
  name: 'Player1',
  coordinates: {
    x: GAME.canvas.parent().width()/2 - 300,
    y: 325
  },
  keyboard: new Keyboard(),
  spells: data.spells.map( spell => new Spell(spell)),
  stats: new Statistique(),
  scale: {x:-2, y:2},
  hud: new HUD({
    coordinates: {
      x: 10,
      y: 10
    },
    healthBar:{
      x: 0,
      y: 10,
      width: 250,
      baseWidth: 250,
      height: 10,
      baseHeight: 10,
      color: '#FF0000'
    },
    energyBar:{
      x: 0,
      y: 20,
      width: 150,
      baseWidth: 150,
      height: 10,
      baseHeight: 10,
      color: '#0000FF'
    },
    // arrows: arrowsBorderP1Generate,
    // arrowsGuard: arrowsGuarP1Generate,
    // ultraModeBackground: ultraModeSprite,
    // arrowsSpritePull: arrowsSpritePull,
  }),
  spritesheet: new Tileset(GAME.context, playerSpritesheetImg, playerSpritesheetJson, 5),
  arrowManager: new ArrowManager({
    update(){
      if (this.coordinates.y > GAME.canvas.height()) {
        this.die();
      }
    }
  }),
  init() {
    let arrowHUD = directions.map( (direction, index) => {
      let arrow = new Sprite({
        coordinates: {
          x:50*(index),
          y:200
        },
        img: arrowSprite[direction+'ArrowBorderImg']
      });
      arrow.direction = direction;
      return arrow;
    });

    let arrowsGuardHUD = directions.map( (direction, index) => {
      let arrow = new Sprite({
        coordinates: {
          x:50*(index),
          y:200
        },
        img: guardArrowSprite['guardArrow'+direction.replace(direction[0], direction[0].toUpperCase())]
      });
      arrow.direction = direction;
      return arrow;
    });

    let arrowsSpriteHUDPull = []

    let directionNumber = -1;
    while (arrowsSpriteHUDPull.length < 40 ) {
      if (!(arrowsSpriteHUDPull.length % 10) ) {
        directionNumber++;
      }
      let arrow = new Sprite({
        idDie: true,
        coordinates: {
          x:0,
          y:0
        },
        img: arrowSprite[directions[directionNumber]+'ArrowBorderImg']
      });
      arrow.direction = directions[directionNumber];

      arrowsSpriteHUDPull.push(arrow);
    }

    this.arrowManager.option.init = function(){
      let arrowDesti = arrowHUD.filter( arrow => arrow.direction == this.direction)[0];
      this.maxCoordinates.y = arrowDesti.getCenter().y;
      this.coordinates.x = arrowDesti.coordinates.x;
    }

    const ultraModeSprite = new Sprite({
      coordinates: {
        x: 0,
        y: 40
      },
      img: ultraModeImage
    });

    this.hud.arrows = arrowHUD;
    this.hud.arrowsGuard = arrowsGuardHUD;
    this.hud.ultraModeBackground = ultraModeSprite;
    this.hud.arrowsSpritePull = arrowsSpriteHUDPull;

    this.arrowManager.generate({}, 40);
  },
  update() {
    if (this.isDie) return;
  }
})
player1.init();


let player2 = new Player({
  name: 'Player2',
  // isDie: true,
  coordinates: {
    x: GAME.canvas.parent().width()/2 - 20,
    y: 325
  },
  keyboard: new Keyboard({up: 73, right: 76, down: 75, left: 74, defenseMode:223, ultraMode:188}),
  spells: data.spells.map( spell => new Spell(spell)),
  stats: new Statistique(),
  scale: {x:2, y:2},
  hud: new HUD({
    coordinates: {
      x: GAME.canvas.width() - 10,
      y: 10
    },
    scale: {x:-1, y:1},
    healthBar:{
      x: 0,
      y: 10,
      width: 250,
      baseWidth: 250,
      height: 10,
      baseHeight: 10,
      color: '#FF0000'
    },
    energyBar:{
      x: 0,
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
    // init(){
    //   let arrowDesti = arrowsBorderP2Generate.filter( arrow => arrow.direction == this.direction)[0];
    //   this.maxCoordinates.y = arrowDesti.getCenter().y;
    //   this.coordinates.x = arrowDesti.coordinates.x;
    // },
    update(){
      if (this.coordinates.y > GAME.canvas.height()) {
        this.die();
      }
    }
  }),
  init() {
    let arrowHUD = directions.reverse().map( (direction, index) => {
      let arrow = new Sprite({
        coordinates: {
          x: -50*index - 50,
          y: 200
        },
        img: arrowSprite[direction+'ArrowBorderImg']
      });
      arrow.direction = direction;
      return arrow;
    });

    let arrowsGuardHUD = directions.map( (direction, index) => {
      let arrow = new Sprite({
        coordinates: {
          x: 50*index,
          y: 200
        },
        img: guardArrowSprite['guardArrow'+direction.replace(direction[0], direction[0].toUpperCase())]
      });
      arrow.direction = direction;
      return arrow;
    });

    let arrowsSpriteHUDPull = []

    let directionNumber = -1;
    while (arrowsSpriteHUDPull.length < 40 ) {
      if (!(arrowsSpriteHUDPull.length % 10) ) {
        directionNumber++;
      }
      let arrow = new Sprite({
        idDie: true,
        coordinates: {
          x:0,
          y:0
        },
        img: arrowSprite[directions[directionNumber]+'ArrowBorderImg']
      });
      arrow.direction = directions[directionNumber];

      arrowsSpriteHUDPull.push(arrow);
    }

    this.arrowManager.option.init = function(){
      let arrowDesti = arrowHUD.filter( arrow => arrow.direction == this.direction)[0];
      this.maxCoordinates.y = arrowDesti.getCenter().y;
      this.coordinates.x = arrowDesti.coordinates.x;
    }

    const ultraModeSprite = new Sprite({
      coordinates: {
        x: 0,
        y: 40
      },
      img: ultraModeImage
    });

    this.hud.arrows = arrowHUD;
    this.hud.arrowsGuard = arrowsGuardHUD;
    this.hud.ultraModeBackground = ultraModeSprite;
    this.hud.arrowsSpritePull = arrowsSpriteHUDPull;

    this.arrowManager.generate({}, 40);
  },
  update() {
    if (this.isDie) return;
  }
})
player2.init();

player1.target = player2;
player2.target = player1;

GAME.update = function () {
  if (player1.isDie && player2.isDie) {
    message = "Egalité";
    return message;
  } else if (player1.isDie) {
    message = player2.name + " win";
    return message;
  } else if (player2.isDie) {
    message = player1.name + " win";
    return message;
  }

  if (audioAnalyser.bufferLoader.isAllLoaded()) {
    audioAnalyser.playSound('battleSong');
  }

  let currentTime = Date.now();
  if ( currentTime - this.lastArrowAt >= 500) {
    this.lastArrowAt = currentTime;
    const directions = ['up', 'right', 'down', 'left'];
    const arrowDirection = directions[Math.floor(Math.random()*directions.length)];
    let arrows = [];

    if (player1.mode != 'ultra') player1.addArrow(arrowDirection);
    if (player2.mode != 'ultra') player2.addArrow(arrowDirection);
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
GAME.scene.push(player1);
GAME.scene.push(player2);
GAME.gameloop();
