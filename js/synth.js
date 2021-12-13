const SimpleSynthesizer = class {
    static audioContext = null;
    static getAudioContext = () => {
      if( ! SimpleSynthesizer.audioContext ) {
        try {
          window.AudioContext = window.AudioContext || window.webkitAudioContext;
          SimpleSynthesizer.audioContext = new AudioContext();
        }
        catch(e) {
          alert('Web Audio API is not supported in this browser');
        }
      }
      return SimpleSynthesizer.audioContext;
    };
    constructor() {
      let volumeslider = document.getElementById('volSlider');
      /*
      volumeslider.min = 0;
      volumeslider.max = 0.3;
      volumeslider.step = 0.005;
      volumeslider.value = 0.03;
      */

      const noteToFreq = midiNoteNumber => 440 * Math.pow(2, (midiNoteNumber - 69)/12);
      const freqs = Array(128).fill().map((_,midiNoteNumber) => noteToFreq(midiNoteNumber));
      this.createVoice = midiNoteNumber => {
        const context = SimpleSynthesizer.getAudioContext();
        const osc = context.createOscillator();
        const amp = context.createGain();

        let waveselect = document.getElementById('waveselect');
        osc.type = waveselect.value;
        /*
        if( waveselect.addEventListener ) {

         waveselect.addEventListener("change", event => {
          osc.type = event.currentTarget.value;
         });
        }*/
        osc.frequency.value = freqs[midiNoteNumber] || noteToFreq(midiNoteNumber);
        osc.connect(amp);

        amp.connect(context.destination);
        amp.gain.value = volumeslider.value;
        const now = context.currentTime;
        //amp.gain.setTargetAtTime(0, now, 0.6);
        osc.start(now);
        return {
  
          stop: () => {
            const now = context.currentTime;
            amp.gain.setTargetAtTime(0, now, 0.1);
            osc.stop(now + 0.2);
          }
        };
      };
    }
    
  };