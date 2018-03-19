export default class {
  constructor(context) {
    this.context = context;
    this.urlListObject = {};
    this.onload;
    this.bufferList = {};
    this.loadCount = 0;
  }

  loadBuffer (url, index) {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    const self = this;

    request.onload = function() {
        self.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    console.log('Error decoding file data: ' + url);
                    return;
                }
                self.bufferList[index] = buffer;
                if (++self.loadCount == Object.keys(self.urlListObject).length){
                  self.onload(self.bufferList);
                }
            }
        );
    }

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }

    request.send();
  }

  load (urlListObject, callback) {
    this.urlListObject = urlListObject;
    this.onload = callback;
    for (let prop in urlListObject) {
      if (urlListObject.hasOwnProperty(prop)) {
        this.loadBuffer(urlListObject[prop], prop);
      }
    }
  }

  isAllLoaded(){
    return (Object.keys(this.urlListObject).length == this.loadCount)? true : false;
  }
}
