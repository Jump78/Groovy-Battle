import BufferLoader from './BufferLoader.class';

export default class {
    constructor(){
      let AudioContext = window.AudioContext || window.webkitAudioContext;

      this.audioCtx = new AudioContext();

      this.sources = [];
      this.playingSource = [];

      this.analyseur = this.audioCtx.createAnalyser();

      this.bufferLength = this.analyseur.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);

      this.bufferLoader = new BufferLoader(this.audioCtx);
    }

    loadSound (urls) {

      this.bufferLoader.load(urls, () => {console.log(this.bufferLoader.bufferList)});

    }

    //playing the audio file
    playSound (name) {
      if (this.playingSource.indexOf(name) >= 0) return;

      //creating source node
      let source = this.audioCtx.createBufferSource();
      //passing in file
      source.buffer = this.bufferLoader.bufferList[name];
      source.loop = true;
      //start playing
      source.connect(this.analyseur);
      this.analyseur.connect(this.audioCtx.destination);  // added
      source.start(0);
      this.playingSource.push(name);
    }

    getByteFrequencyData () {
      this.analyseur.getByteFrequencyData(this.dataArray);
      let self = this;
      let freq = [];
      this.dataArray.forEach( (item, i) => {
        if (item > 0) {
          return freq.push({
            frequency: (i * self.audioCtx.sampleRate/self.analyseur.fftSize),
            intensity : item
          })
        }
        return false;
      });

      return freq;
    }
}
