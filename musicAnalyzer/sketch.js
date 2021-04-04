let amplitude;
let fft;
let bass = 0;
let lowMid = 0;
let highMid = 0;
let treble = 0;
let mySound;
const directions = ['up', 'left', 'down', 'left'];
let arrows = [];

function setup() {
  amplitude = new p5.Amplitude();
  fft = new p5.FFT();

  const input = document.getElementById('input');

  input.addEventListener('change', function(event){
    event.preventDefault();

    let sound = URL.createObjectURL(this.files[0]);
    sound.onend = function(e) {
      URL.revokeObjectURL(this.src);
    }

    mySound = loadSound(sound, _ => mySound.play());
    mySound.onended( _ => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=utf-8,' + JSON.stringify(arrows));
      element.setAttribute('download', this.files[0].name.replace(/\.[^/.]+$/, ".json"));

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    });
  })

}

function draw() {
  fft.analyze();

  let currentBass = fft.getEnergy("bass");
  let currentLowMid = fft.getEnergy("lowMid");
  let currentHighMid = fft.getEnergy("highMid");
  let currentTreble = fft.getEnergy("treble");
  if (currentBass - bass > 15) {
    const newArrow = {
      direction: 'up',
      time: mySound.currentTime()
    };
    arrows.push(newArrow);
  }

  if (currentLowMid - lowMid > 15) {
    const newArrow = {
      direction: 'right',
      time: mySound.currentTime()
    };
    arrows.push(newArrow);
  }

  if (currentHighMid - highMid > 15) {
    const newArrow = {
      direction: 'down',
      time: mySound.currentTime()
    };
    arrows.push(newArrow);
  }

  if (currentTreble - treble > 15) {
    const newArrow = {
      direction: 'left',
      time: mySound.currentTime()
    };
    arrows.push(newArrow);
  }

  bass = currentBass;
  lowMid = currentLowMid;
  highMid = currentHighMid;
  treble = currentTreble;
}
