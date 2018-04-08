import mainCss from "./assets/style/main.css";
import indexCss from "./assets/style/index.css";
import logo from "./assets/img/groovybattlelogo.png";

import $ from 'jquery';

$(function() {
  $('#logo').attr('src', logo);

  $('.menu-item').on('click', function(event) {
    window.location = $(this).attr('data-to');
  })

  let player1Controle = JSON.parse(localStorage.getItem('player1Controle'));
  let player2Controle = JSON.parse(localStorage.getItem('player2Controle'));

  if (!player1Controle) {
    player1Controle = {
      up : 90,
      right : 68,
      down : 83,
      left : 81,
      defenseMode : 16,
      ultraMode: 32
    }
    localStorage.setItem('player1Controle', JSON.stringify(player1Controle));
  }

  if (!player2Controle) {
    player2Controle = {
      up: 73,
      right: 76,
      down: 75,
      left: 74,
      defenseMode: 223,
      ultraMode: 188
    }
    localStorage.setItem('player2Controle', JSON.stringify(player2Controle));
  }
})
