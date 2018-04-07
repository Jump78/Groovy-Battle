import mainCss from "./assets/style/main.css";
import logo from "./assets/img/groovybattlelogo.png";

import $ from 'jquery';

$('#logo').attr('src', logo);

$('.menu-item').on('click', function(event) {
  window.location = $(this).attr('data-to');
})
