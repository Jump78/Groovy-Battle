import gameCss from "./assets/style/game.css";
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
import songData from './assets/song/UnexpectedVibes.json';

import { eventManager } from './class/EventManager.singleton.js';
$(function() {

  $('#toHomeScreen').on('click', _ => {
    window.location = '/';
  })

  $('#nextBattle').on('click', _ => {
    window.location.reload();
  })

  let audioAnalyser = new Audio();

  audioAnalyser.loadSound({battleSong: song});

  const arrowSprite = {upArrowBorderImg, rightArrowBorderImg, downArrowBorderImg, leftArrowBorderImg};
  const guardArrowSprite = {guardArrowDown, guardArrowLeft, guardArrowUp, guardArrowRight};
  const directions = ['left', 'up', 'down', 'right'];

  const backgroundSprite = new Image();
  backgroundSprite.src = background;

  const GAME = new Game({
    canvas: $('#game'),
    online: false
  })

  let message = '';

  let test = 0;
  let player1 = new Player({
    name: 'Player1',
    coordinates: {
      x: GAME.canvas.width()/2 - 300,
      y: 325
    },
    keyboard: new Keyboard(JSON.parse(localStorage.getItem('player1Controle'))),
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
      combo: {
        x: 25,
        y: 450,
        color: '#BADA55',
        font: "60px Impact",
        textAlign: "start",
        value: 0
      },
      comboTimer: {
        x: 0,
        y: 460,
        width: 50,
        baseWidth: 50,
        height: 10
      }
    }),
    spritesheet: new Tileset(GAME.context, playerSpritesheetImg, playerSpritesheetJson, 5),
    arrowManager: new ArrowManager({}),
    eventManager : eventManager,
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

      let player = this;
      this.arrowManager.option.update = function(){
        if (this.coordinates.y > this.maxCoordinates.y + 25) {
          this.fade = true;
        }
        if (this.coordinates.y > this.maxCoordinates.y) {
          player.combo = 0;
          player.stats.comboMultiplier = 1;
        }
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
    coordinates: {
      x: GAME.canvas.width()/2 - 20,
      y: 325
    },
    keyboard: new Keyboard(JSON.parse(localStorage.getItem('player2Controle'))),
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
      },
      combo: {
        x: 25,
        y: 450,
        color: '#BADA55',
        font: "60px Impact",
        textAlign: "right",
        value: 0
      },
      comboTimer: {
        x: 0,
        y: 460,
        width: 50,
        baseWidth: 50,
        height: 10
      }
    }),
    spritesheet: new Tileset(GAME.context, playerSpritesheetImg, playerSpritesheetJson, 5),
    arrowManager: new ArrowManager({}),
    eventManager : eventManager,
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
            x: -50*index - 50,
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

      let player = this;
      this.arrowManager.option.update = function(){
        if (this.coordinates.y > this.maxCoordinates.y + 25) {
          this.fade = true;
        }
        if (this.coordinates.y > this.maxCoordinates.y) {
          player.combo = 0;
          player.stats.comboMultiplier = 1;
        }
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
      for (var i = 0; i < 15; i++) {
        let messageLeft = managePileEvent();
        if (!messageLeft) break;
      }

      // Check if both player are dead
      if (player1.isDie && player2.isDie) {
        message = "Equality";
        this.isRoundFinished = true;
        this.resetRound(player1, player2);

      } else if ((player1.isDie || player2.isDie) && !this.isRoundFinished){ // Check if one player is dead
        const winner = (player1.isDie)? player2 : player1; // Find the player who's dead
        winner.roundWon++;
        this.isRoundFinished = true;
        if (winner.roundWon >= 2) { // If the winner have win 2 round or more
          $('.btn-row').show();
          return message = winner.name + " wins the figth"; // the player has win the fight
        }

        message = winner.name + " wins the round";
        this.resetRound(player1, player2); //Launch au new round
      }

    if (audioAnalyser.bufferLoader.isAllLoaded()) {
      audioAnalyser.playSound('battleSong');
      let currentTime = audioAnalyser.audioCtx.currentTime;
      let arrow = songData.filter(item => {
        let distance = 200;
        let speed = (2 * 60); // 2 pixel at 60 fps, so 180pixels in a second
        return currentTime >= item.time - (distance/speed);
      })[0];
      if (!arrow) return;
      songData.splice(songData.indexOf(arrow), 1);
      if ((!player1.isDie && !player2.isDie) && player1.mode != 'ultra') player1.addArrow(arrow.direction);
      if ((!player1.isDie && !player2.isDie) && player2.mode != 'ultra') player2.addArrow(arrow.direction);
    }

    /*let currentTime = Date.now();
    if ( currentTime - this.lastArrowAt >= 500) {
      this.lastArrowAt = currentTime;
      const directions = ['up', 'right', 'down', 'left'];
      const arrowDirection = directions[Math.floor(Math.random()*directions.length)];
      let arrows = [];

      if ((!player1.isDie && !player2.isDie) && player1.mode != 'ultra') player1.addArrow(arrowDirection);
      if ((!player1.isDie && !player2.isDie) && player2.mode != 'ultra') player2.addArrow(arrowDirection);
    } */
  }

  GAME.scene.push({
    render(ctx) {
      ctx.drawImage(backgroundSprite, 0, 0, GAME.canvas.width(), GAME.canvas.height());
    },
    update(){}
  });
  GAME.scene.push(player1);
  GAME.scene.push(player2);
  GAME.scene.push({
    render(ctx) {
      if (!GAME.isRoundFinished) return;
      ctx.fillStyle = '#FF0000';
      ctx.font = "60px Impact";
      ctx.textAlign = "center";
      ctx.fillText(message, GAME.canvas.width()/2, GAME.canvas.height()/2);
    },
    update(){}
  });
  GAME.gameloop();

  function managePileEvent() {
    let message = eventManager.getFirst();
    if (!message) return;

    if (message.player == 1) {
      player1.receiveAction(message);
    } else if(message.player == 2){
      player2.receiveAction(message);
    } else {
      if (eventManager.id == 1) {
        player1.receiveAction(message);
      } else if (eventManager.id == 2) {
        player2.receiveAction(message);
      }
    }

    return message;
  }
})
