let amplitude;
let mySound;
const directions = ['up', 'left', 'down', 'left'];
let arrows = [];

function setup() {
  amplitude = new p5.Amplitude();

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
      element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(arrows)));
      element.setAttribute('download', this.files[0].name.replace(/\.[^/.]+$/, ".json"));

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    });
  })

}

function draw() {
  let frame = amplitude.getLevel();
  if (!frame) return;

  if (frame>0.33) {
    const newArrow = {
      direction: directions[Math.floor(Math.random()*(directions.length-1))],
      time: mySound.currentTime()
    };
    arrows.push(newArrow);
  }
}
