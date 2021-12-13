window.AudioContext = window.AudioContext || window.webkitAudioContext;

let audioCtx = new AudioContext();

let destinationNode = audioCtx.destination;

let volumeNode = audioCtx.createGain();

let modGain1 = audioCtx.createGain();
let modGain2 = audioCtx.createGain();
let modGain3 = audioCtx.createGain();

let filterNode =  audioCtx.createBiquadFilter();

function play(){ 
  let oscillatorNode = audioCtx.createOscillator();
  
  let modNode1 = audioCtx.createOscillator();
  let modNode2 = audioCtx.createOscillator();
  let modNode3 = audioCtx.createOscillator();

  modNode1.connect(modGain1);
  modGain1.connect(volumeNode.gain);
  modGain1.gain.value = document.getElementById("modGain1").value;

  modNode2.connect(modGain2);
  modGain2.connect(oscillatorNode.frequency);
  modGain2.gain.value = document.getElementById("modGain2").value;

  modNode3.connect(modGain3);
  modGain3.connect(filterNode.frequency);
  modGain3.gain.value = document.getElementById("modGain3").value;

  oscillatorNode.connect(filterNode);
  filterNode.connect(volumeNode);
  volumeNode.connect(destinationNode);
 
  let t0 = audioCtx.currentTime;

  oscillatorNode.start(t0);

  modNode1.start(t0);
  modNode2.start(t0);
  modNode3.start(t0);
  
  //セレクターが変更された時の処理
  let typeSelect = document.getElementById("typeSelect");
  typeSelect.addEventListener("change", function(event){
    oscillatorNode.type = event.currentTarget.value;
  });
  oscillatorNode.type = typeSelect.value;

  let typeSelect1 = document.getElementById("typeSelect1");
  typeSelect1.addEventListener("change", function(event){
    modNode1.type = event.currentTarget.value;
  });
  modNode1.type = typeSelect1.value;

  let typeSelect2 = document.getElementById("typeSelect2");
  typeSelect2.addEventListener("change", function(event){
    modNode2.type = event.currentTarget.value;
  });
  modNode2.type = typeSelect2.value;

  let typeSelect3 = document.getElementById("typeSelect3");
  typeSelect3.addEventListener("change", function(event){
    modNode3.type = event.currentTarget.value;
  });
  modNode3.type = typeSelect3.value;

  
  //周波数が変更された時の処理
  let frequencyNumber = document.getElementById("frequencyNumber");
  frequencyNumber.addEventListener("input", function(event){
    oscillatorNode.frequency.value = event.currentTarget.value;
  });
  oscillatorNode.frequency.value = frequencyNumber.value;
  
  
  let frequencyNumber1 = document.getElementById("frequencyNumber1");
  frequencyNumber1.addEventListener("input", function(event){
    modNode1.frequency.value = event.currentTarget.value;
  });
  modNode1.frequency.value = frequencyNumber1.value;

  let frequencyNumber2 = document.getElementById("frequencyNumber2");
  frequencyNumber2.addEventListener("input", function(event){
    modNode2.frequency.value = event.currentTarget.value;
  });
  modNode2.frequency.value = frequencyNumber2.value;

  let frequencyNumber3 = document.getElementById("frequencyNumber3");
  frequencyNumber3.addEventListener("input", function(event){
    modNode3.frequency.value = event.currentTarget.value;
  });
  modNode3.frequency.value = frequencyNumber3.value;
  
  
  let stopBtn = document.getElementById("stopBtn");
  stopBtn.addEventListener("click", function(){
    oscillatorNode.stop(0);
    modNode1.stop(0);
    modNode2.stop(0);
    modNode3.stop(0);
  });
}

let playBtn = document.getElementById("playBtn");
playBtn.addEventListener("click", function(){
  play();
});


let volSlider = document.getElementById("volSlider");
volSlider.addEventListener("input", function(event){
  volumeNode.gain.value = event.currentTarget.value;
});

let volSlider1 = document.getElementById("modGain1");
volSlider1.addEventListener("input", function(event){
  modGain1.gain.value = event.currentTarget.value;
});

let volSlider2 = document.getElementById("modGain2");
volSlider2.addEventListener("input", function(event){
  modGain2.gain.value = event.currentTarget.value;
});

let volSlider3 = document.getElementById("modGain3");
volSlider3.addEventListener("input", function(event){
  modGain3.gain.value = event.currentTarget.value;
});

let filSelect = document.getElementById("filterType");
filSelect.addEventListener("change", function(event){
  filterNode.type = event.currentTarget.value;
});
//filterNode.type = filSelect.value;

let cutoffSlider = document.getElementById("cutoff");
cutoffSlider.addEventListener("input", function(event){
  filterNode.frequency.value = event.currentTarget.value;
});

