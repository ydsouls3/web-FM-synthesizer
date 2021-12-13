window.AudioContext = window.AudioContext || window.webkitAudioContext;

/*
let audioCtx = new AudioContext();

let destinationNode = audioCtx.destination;

let volumeNode = audioCtx.createGain();

let modGain1 = audioCtx.createGain();
let modGain2 = audioCtx.createGain();
let modGain3 = audioCtx.createGain();

let filterNode =  audioCtx.createBiquadFilter();
*/

const noteToFreq = midiNoteNumber => 440 * Math.pow(2, (midiNoteNumber - 69)/12);
const freqs = Array(128).fill().map((_,midiNoteNumber) => noteToFreq(midiNoteNumber));

/*
createVoice = midiNoteNumber => {
    const context = SimpleSynthesizer.getAudioContext();
    const osc = context.createOscillator();
    const amp = context.createGain();
    //
    // for legacy browsers
    osc.start = osc.start || osc.noteOn;
    osc.stop  = osc.stop  || osc.noteOff;
    //
    osc.type = waveselect.value;
    osc.frequency.value = freqs[midiNoteNumber] || noteToFreq(midiNoteNumber);
    osc.connect(amp);
    //
    // for legacy browsers
    amp.gain.setTargetAtTime = amp.gain.setTargetAtTime || amp.gain.setTargetValueAtTime;
    //
    amp.connect(context.destination);
    amp.gain.value = volumeslider.value;
    const now = context.currentTime;
    amp.gain.setTargetAtTime(0, now, 0.6);
    osc.start(now);
    return {
      stop: () => {
        const now = context.currentTime;
        amp.gain.setTargetAtTime(0, now, 0.1);
        osc.stop(now + 0.2);
      }
    };
  };

*/

createVoice = midiNoteNumber =>{ 

  let attack = document.getElementById("attackSlider").value;
  let decay = document.getElementById("decaySlider").value;
  let sustain = document.getElementById("sustainSlider").value;

  let audioCtx = new AudioContext();
  let destinationNode = audioCtx.destination;
    
  let oscillatorNode = audioCtx.createOscillator();
  let filterNode =  audioCtx.createBiquadFilter();
  let volumeNode = audioCtx.createGain();

  //モジュレータ
  let modNode1 = audioCtx.createOscillator();
  let modNode2 = audioCtx.createOscillator();
  let modNode3 = audioCtx.createOscillator();

  let modGain1 = audioCtx.createGain();
  let modGain2 = audioCtx.createGain();
  let modGain3 = audioCtx.createGain();
  
  modNode1.connect(modGain1);
  modGain1.connect(volumeNode.gain);
  modGain1.gain.value = document.getElementById("modGain1").value;

  modNode2.connect(modGain2);
  modGain2.connect(oscillatorNode.frequency);
  modGain2.gain.value = document.getElementById("modGain2").value;

  modNode3.connect(modGain3);
  modGain3.connect(filterNode.frequency);
  modGain3.gain.value = document.getElementById("modGain3").value;
  
  let typeSelect1 = document.getElementById("typeSelect1");
  modNode1.type = typeSelect1.value;

  let typeSelect2 = document.getElementById("typeSelect2");
  modNode2.type = typeSelect2.value;
  
  let typeSelect3 = document.getElementById("typeSelect3");
  modNode3.type = typeSelect3.value;

  let frequencyNumber1 = document.getElementById("frequencyNumber1");
  modNode1.frequency.value = frequencyNumber1.value;

  let frequencyNumber2 = document.getElementById("frequencyNumber2");
  modNode2.frequency.value = frequencyNumber2.value;

  let frequencyNumber3 = document.getElementById("frequencyNumber3");
  modNode3.frequency.value = frequencyNumber3.value;
  //

  //音量
  let volSlider = document.getElementById("volSlider");
  volumeNode.gain.value = 0;

  //セレクターが変更された時の処理
  let typeSelect = document.getElementById("typeSelect");
  /*
  typeSelect.addEventListener("change", event => {
    oscillatorNode.type = event.currentTarget.value;
  });
  */
  oscillatorNode.type = typeSelect.value;

  //周波数が変更された時の処理
  oscillatorNode.frequency.value = freqs[midiNoteNumber] || noteToFreq(midiNoteNumber);

  //フィルター設定
  let filSelect = document.getElementById("filterType");
  filterNode.type = filSelect.value;
  let cutoffSlider = document.getElementById("cutoff");
  filterNode.frequency.value = cutoffSlider.value;

  oscillatorNode.connect(filterNode);
  filterNode.connect(volumeNode);
  volumeNode.connect(destinationNode);
 
  let t0 = audioCtx.currentTime;
  
  volumeNode.gain.setTargetAtTime(volSlider.value, t0, attack);
  let t1 = t0 + attack;
  volumeNode.gain.setTargetAtTime(sustain, t1, decay);

  oscillatorNode.start(t0);

  modNode1.start(t0);
  modNode2.start(t0);
  modNode3.start(t0);

  /*
  let stopBtn = document.getElementById("stopBtn");
  stopBtn.addEventListener("click", function(){
    oscillatorNode.stop(0);
    modNode1.stop(0);
    modNode2.stop(0);
    modNode3.stop(0);
  });
  */

  return {
  
    stop: () => {
      const now = audioCtx.currentTime;
      let release = document.getElementById("releaseSlider").value;
      volumeNode.gain.setTargetAtTime(0, now, release);
      oscillatorNode.stop(now + 0.1);
      modNode1.stop(now + 0.1);
      modNode2.stop(now + 0.1);
      modNode3.stop(now + 0.1);
    }
  };   
};

const TONE_NAMES = [
    ['C'], ['C#','Db'],
    ['D'], ['Eb','D#'],
    ['E'],
    ['F'], ['F#','Gb'],
    ['G'], ['Ab','G#'],
    ['A'], ['Bb','A#'],
    ['B']
];

//let synth = new SimpleSynthesizer();
const pianoKeys = {
      all: Array(128).fill().map(() => ({element: null, voice: null})),
      pressed: [],
      //chordActiveElements: [],
};
/*
    this.chordLabel = {
      element: document.getElementById('chord'),
      initialize: () => this.chordLabel.default = this.chordLabel.element?.innerHTML,
      clear: () => this.chordLabel.element && (this.chordLabel.element.innerHTML = this.chordLabel.default),
    };
    this.chordLabel.initialize();
*/
const leftEnd = {
      note: { default: 4 * 12 + 5 },
      update: n => {
        //leftEnd.note.chord = n + 5;
        leftEnd.note.C = Math.ceil(n / 12) * 12;
      },
      initialize: () => leftEnd.update(leftEnd.note.default)
};
leftEnd.initialize();

const keyboard = document.getElementById('pianokeyboard');
if( keyboard ) {
      leftEnd.whitekey = {default: 4 * 7 + 3};
      let pointerdown = 'mousedown';
      let pointerup = 'mouseup';
      if( typeof window.ontouchstart !== 'undefined' ) {
      	pointerdown = 'touchstart';
      	pointerup = 'touchend';
      }
      keyboard.innerHTML = '';
      let [whiteleft, blackindex, whitewidth, blackoffsets] = [0, 6];
      const getWidthOf = element => element.clientWidth + 2 * element.clientLeft;
      pianoKeys.all.forEach((key, midiNoteNumber) => {
        const element = key.element = document.createElement('div');
        keyboard.appendChild(element);
        if( blackindex >= 5 ) {
          element.classList.add('whitekey');
          element.style.left = whiteleft+'px';
          whiteleft += (whitewidth ?? (whitewidth = getWidthOf(element)));
          blackindex -= 5;
        } else {
          element.classList.add('blackkey');
          const blackleft = whiteleft - (blackoffsets ?? (
            blackoffsets = Array(5).fill(getWidthOf(element)).map((w,i) => (i>1 ? w/i : w - w/(4-i)))
          ))[blackindex];
          element.style.left = blackleft+'px';
          blackindex += 7;
        }
        
        element.addEventListener(pointerdown, e => {
          //this.chordLabel.clear(); 
          this.noteOn(midiNoteNumber); e.preventDefault();
        }, false);
        
        element.addEventListener(pointerup, e => noteOff(key), false);
        element.addEventListener('mouseover', e => (e.buttons & 1) && noteOn(midiNoteNumber), false);
        element.addEventListener('mouseout', e => (e.buttons & 1) && noteOff(key), false);
      });
      keyboard.scrollLeft = whitewidth * leftEnd.whitekey.default;
      keyboard.addEventListener("scroll",
        e => leftEnd.update(Math.ceil(128 * keyboard.scrollLeft / keyboard.scrollWidth))
      );
      ['dblclick','selectstart'].forEach(type => keyboard.addEventListener(type, e => e.preventDefault()));
      const pcKey = {
      	bindings: {
          KeyQ:0, Digit2:1,
          KeyW:2, Digit3:3,
          KeyE:4,
          KeyR:5, Digit5:6,
          KeyT:7, Digit6:8,
          KeyY:9, Digit7:10,
          KeyU:11,
          KeyI:12, Digit9:13,
          KeyO:14, Digit0:15,
          KeyP:16,
          BracketLeft:17, Equal:18,
          BracketRight:19,
      	},
      	activeKeys: []
      };
      keyboard.addEventListener("keydown", e => {
        console.log(e.code); 
        if( e.repeat ) return;
        const midiNoteNumber = pcKey.bindings[e.code] + leftEnd.note.C;
        const key = pianoKeys.all[midiNoteNumber];
        if( key?.voice ) return;
        noteOn(midiNoteNumber);
        pcKey.activeKeys[e.code] = key;
        //this.chordLabel.clear();
      }, false);
      keyboard.addEventListener("keyup", e => {
        const key = pcKey.activeKeys[e.code];
        key && noteOff(key);
        pcKey.activeKeys[e.code] = undefined;
      }, false);
      
}
noteOn = (midiNoteNumber) => {
      /*if( order <= 1 ) {
        let element;
        while( typeof (element = pianoKeys.chordActiveElements.pop()) !== 'undefined' ) {
          element.classList.remove('chord', 'root');
        }
      }*/
      if( midiNoteNumber || midiNoteNumber === 0 ) {
        const key = pianoKeys.all[midiNoteNumber];
        if( key ) {
          if( ! key.voice ) {
            key.voice = createVoice(midiNoteNumber);
            pianoKeys.pressed.push(key);
          }
          const element = key.element
          if( element ) {
            const classList = element.classList;
            classList.add('pressed');
            /*if( order ) {
              classList.add('chord');
              pianoKeys.chordActiveElements.push(element);
              order == 1 && classList.add('root');
            }*/
          }
        }
      }
    };
noteOff = key => {
      if( key.voice ) { key.voice.stop(); key.voice = null; }
      key.element?.classList.remove('pressed');
      const p = pianoKeys.pressed;
      const i = p.indexOf(key);
      i >= 0 && p.splice(i, 1);
    };
/*
    this.chordOn = midiNoteNumbers => {
      this.chordOff();
      midiNoteNumbers.forEach((n,i) => this.noteOn(n - Math.floor((n - leftEnd.note.chord) / 12) * 12, i+1));
    };
    this.chordOff = () => {
      let key; while( typeof (key = pianoKeys.pressed.pop()) !== 'undefined' ) this.noteOff(key);
    };
*/

let volSlider = document.getElementById("volSlider");
volSlider.addEventListener("input", event => {
  volumeNode.gain.value = event.currentTarget.value;
});

