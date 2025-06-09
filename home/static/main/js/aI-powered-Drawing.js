let classifier;
let canvas;
let isModelReady = false;

function setup() {
  // create a 300×300 drawing canvas
  canvas = createCanvas(300, 300);
  canvas.parent('canvasContainer');
  background(255);

  // load DoodleNet
  classifier = ml5.imageClassifier('DoodleNet', () => {
    console.log('🖼️ Model Loaded');
    isModelReady = true;
    document.getElementById('guessBtn').disabled = false;
  });
}

function draw() {
  // draw while mouse is pressed
  if (mouseIsPressed) {
    strokeWeight(8);
    stroke(0);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

// clear canvas
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clearBtn').addEventListener('click', () => {
    clearCanvas();
  });
  document.getElementById('guessBtn').addEventListener('click', () => {
    if (!isModelReady) return;
    // classify the canvas
    classifier.classify(canvas, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      document.getElementById('label').innerText = results[0].label;
      document.getElementById('confidence').innerText = (results[0].confidence * 100).toFixed(2) + '%';
    });
  });
});

function clearCanvas() {
  clear();
  background(255);
  document.getElementById('label').innerText = '--';
  document.getElementById('confidence').innerText = '--';
}
