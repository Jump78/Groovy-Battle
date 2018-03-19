import BufferLoader from './BufferLoader.class';

export default class {
    constructor(){
      let AudioContext = window.AudioContext || window.webkitAudioContext;

      this.audioCtx = new AudioContext();

      this.analyseur = this.audioCtx.createAnalyser();
      this.analyseur.fftSize = 2048;

      this.bufferLength = this.analyseur.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);

      this.bufferLoader = new BufferLoader(this.audioCtx);
    }

    loadSound (urls) {

      this.bufferLoader.load(urls, () => console.log(this.bufferLoader.isAllLoaded()));

    }

    //playing the audio file
    playSound (name, loop) {
      //creating source node
      let source = this.audioCtx.createBufferSource();

      //passing in file
      source.buffer = this.bufferLoader[name];
      source.loop = (loop)? loop : false;
      //start playing
      source.connect(this.analyseur);
      this.analyseur.connect(this.audioCtx.destination);  // added
      source.start(0);
    }

    getByteFrequencyData () {
      this.analyseur.getByteFrequencyData(this.dataArray);
      return this.dataArray;
    }
}
