import $ from 'jquery';

const CANVAS = $('#game');
const CANVAS_WIDTH = CANVAS.parent().width();
const CANVAS_HEIGHT = CANVAS.parent().height();

CANVAS.attr('width', CANVAS_WIDTH);
CANVAS.attr('height', CANVAS_HEIGHT);
