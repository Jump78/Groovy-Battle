import mainCss from "./assets/style/main.css";
import logo from "./assets/img/groovybattlelogo.png";

import $ from 'jquery';

$(function() {
  $('#logo').attr('src', logo);

  const keyboardMap = {
    0 : "That key has no keycode",
    3 : "break",
    8 : "backspace / delete",
    9 : "tab",
    12 : 'clear',
    13 : "enter",
    16 : "shift",
    17 : "ctrl",
    18 : "alt",
    19 : "pause/break",
    20 : "caps lock",
    21 : "hangul",
    25 : "hanja",
    27 : "escape",
    28 : "conversion",
    29 : "non-conversion",
    32 : "spacebar",
    33 : "page up",
    34 : "page down",
    35 : "end",
    36 : "home",
    37 : "left arrow",
    38 : "up arrow",
    39 : "right arrow",
    40 : "down arrow",
    41 : "select",
    42 : "print",
    43 : "execute",
    44 : "Print Screen",
    45 : "insert",
    46 : "delete",
    47 : "help",
    48 : "0",
    49 : "1",
    50 : "2",
    51 : "3",
    52 : "4",
    53 : "5",
    54 : "6",
    55 : "7",
    56 : "8",
    57 : "9",
    58 : ":",
    59 : "semicolon (firefox), equals",
    60 : "<",
    61 : "equals (firefox)",
    63 : "ß",
    64 : "@ (firefox)",
    65 : "a",
    66 : "b",
    67 : "c",
    68 : "d",
    69 : "e",
    70 : "f",
    71 : "g",
    72 : "h",
    73 : "i",
    74 : "j",
    75 : "k",
    76 : "l",
    77 : "m",
    78 : "n",
    79 : "o",
    80 : "p",
    81 : "q",
    82 : "r",
    83 : "s",
    84 : "t",
    85 : "u",
    86 : "v",
    87 : "w",
    88 : "x",
    89 : "y",
    90 : "z",
    91 : "Windows Key / Left ⌘ / Chromebook Search key",
    92 : "right window key",
    93 : "Windows Menu / Right ⌘",
    95: "sleep",
    96 : "numpad 0",
    97 : "numpad 1",
    98 : "numpad 2",
    99 : "numpad 3",
    100 : "numpad 4",
    101 : "numpad 5",
    102 : "numpad 6",
    103 : "numpad 7",
    104 : "numpad 8",
    105 : "numpad 9",
    106 : "multiply",
    107 : "add",
    108 : "numpad period (firefox)",
    109 : "subtract",
    110 : "decimal point",
    111 : "divide",
    112 : "f1",
    113 : "f2",
    114 : "f3",
    115 : "f4",
    116 : "f5",
    117 : "f6",
    118 : "f7",
    119 : "f8",
    120 : "f9",
    121 : "f10",
    122 : "f11",
    123 : "f12",
    124 : "f13",
    125 : "f14",
    126 : "f15",
    127 : "f16",
    128 : "f17",
    129 : "f18",
    130 : "f19",
    131 : "f20",
    132 : "f21",
    133 : "f22",
    134 : "f23",
    135 : "f24",
    144 : "num lock",
    145 : "scroll lock",
    160 : "^",
    161 : '!',
    163 : "#",
    164 : '$',
    165 : 'ù',
    166 : "page backward",
    167 : "page forward",
    168 : "refresh",
    169 : "closing paren (AZERTY)",
    170 : '*',
    171 : "~ + * key",
    172 : "home key",
    173 : "minus (firefox), mute/unmute",
    174 : "decrease volume level",
    175 : "increase volume level",
    176 : "next",
    177 : "previous",
    178 : "stop",
    179 : "play/pause",
    180 : "e-mail",
    181 : "mute/unmute (firefox)",
    182 : "decrease volume level (firefox)",
    183 : "increase volume level (firefox)",
    186 : "semi-colon / ñ",
    187 : "equal sign",
    188 : "comma",
    189 : "dash",
    190 : "period",
    191 : "forward slash / ç",
    192 : "grave accent / ñ / æ / ö",
    193 : "?, / or °",
    194 : "numpad period (chrome)",
    219 : "open bracket",
    220 : "back slash",
    221 : "close bracket / å",
    222 : "single quote / ø / ä",
    223 : "`",
    224 : "left or right ⌘ key (firefox)",
    225 : "altgr",
    226 : "< /git >, left back slash",
    230 : "GNOME Compose Key",
    231 : "ç",
    233 : "XF86Forward",
    234 : "XF86Back",
    240 : "alphanumeric",
    242 : "hiragana/katakana",
    243 : "half-width/full-width",
    244 : "kanji",
    255 : "toggle touchpad"
  };

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
  }

  if (!player2Controle) {
    player2Controle = {
      up: 73,
      right: 76,
      down: 75,
      left: 74,
      defenseMode:223,
      ultraMode:188
    }
  }

  const j1Input = $('form.input-j1 input');
  j1Input.each((index, input) => {
    $(input).val(keyboardMap[player1Controle[$(input).attr('name')]]);
  });

  const j2Input = $('form.input-j2 input');
  j2Input.each((index, input) => {
    $(input).val(keyboardMap[player2Controle[$(input).attr('name')]]);
  });


  $('form.input-j1').on('keyup', 'input', function(event){
    const input = $(this);

    $(input).val(keyboardMap[event.keyCode]);
    player1Controle[input.attr('name')] = event.keyCode;

    localStorage.setItem('player1Controle', JSON.stringify(player1Controle))
  })

  $('form.input-j2').on('keyup', 'input', function(event){
    const input = $(this);

    $(input).val(keyboardMap[event.keyCode]);
    player2Controle[input.attr('name')] = event.keyCode;

    localStorage.setItem('player2Controle', JSON.stringify(player2Controle))
  })
});
