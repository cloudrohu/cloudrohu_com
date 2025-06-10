const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");

const brushTypeSelect = document.getElementById("brushType");
const shapeTypeSelect = document.getElementById("shapeType");
const brushSizeInput = document.getElementById("brushSize");
const colorPicker = document.getElementById("colorPicker");
const uploadImage = document.getElementById("uploadImage");
const sound = document.getElementById("drawSound");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");
const saveAsBtn = document.getElementById("saveAsBtn");

let isDrawing = false;
let startX, startY;
let currentX, currentY;

let undoStack = [];
let redoStack = [];

// Save current canvas state to undo stack
function saveState() {
  redoStack = [];
  undoStack.push(canvas.toDataURL());
  if (undoStack.length > 50) undoStack.shift();
}

// Undo last action
function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    let imgData = undoStack[undoStack.length - 1];
    let img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = imgData;
  }
}

// Redo last undone action
function redo() {
  if (redoStack.length) {
    let imgData = redoStack.pop();
    let img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = imgData;
    undoStack.push(imgData);
  }
}

// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
}

// Load image from input
uploadImage.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    saveState();
  };
  img.src = URL.createObjectURL(file);
});

// Draw a shape with smoothing
function drawShape(x1, y1, x2, y2, type, size, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.globalAlpha = 1.0;

  let width = x2 - x1;
  let height = y2 - y1;

  ctx.beginPath();

  switch (type) {
    case "rectangle":
      ctx.strokeRect(x1, y1, width, height);
      break;

    case "square":
      let side = Math.min(Math.abs(width), Math.abs(height));
      width = width < 0 ? -side : side;
      height = height < 0 ? -side : side;
      ctx.strokeRect(x1, y1, width, height);
      break;

    case "circle":
      let radius = Math.sqrt(width * width + height * height);
      ctx.arc(x1, y1, radius, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case "line":
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      break;

    case "roundedRect":
      const r = 20;
      let rw = width;
      let rh = height;
      let rx = x1;
      let ry = y1;

      if (width < 0) {
        rw = -width;
        rx = x1 - rw;
      }
      if (height < 0) {
        rh = -height;
        ry = y1 - rh;
      }

      ctx.moveTo(rx + r, ry);
      ctx.lineTo(rx + rw - r, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
      ctx.lineTo(rx + rw, ry + rh - r);
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh);
      ctx.lineTo(rx + r, ry + rh);
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r);
      ctx.lineTo(rx, ry + r);
      ctx.quadraticCurveTo(rx, ry, rx + r, ry);
      ctx.stroke();
      break;

    default:
      break;
  }
  ctx.closePath();
}

// Freehand brush drawing with brush types
function drawFree(x, y) {
  let brush = brushTypeSelect.value;
  let size = brushSizeInput.value;
  let color = colorPicker.value;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (brush === "pencil") {
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = color;
    ctx.lineWidth = size / 2;
  } else if (brush === "marker") {
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 3;
  } else if (brush === "highlighter") {
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 5;
  } else if (brush === "brush") {
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 1.5;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.globalAlpha = 1.0;
}

// Main drawing logic with shape live preview
canvas.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;

  if (shapeTypeSelect.value === "") {
    // Freehand start
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    drawFree(startX, startY);
  } else {
    // For shape start, save current canvas for preview
    saveState();
  }

  playSound();
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  currentX = e.offsetX;
  currentY = e.offsetY;

  if (shapeTypeSelect.value === "") {
    // freehand drawing
    drawFree(currentX, currentY);
  } else {
    // live preview shapes
    let lastState = undoStack[undoStack.length - 1];
    let img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      drawShape(startX, startY, currentX, currentY, shapeTypeSelect.value, brushSizeInput.value, colorPicker.value);
    };
    img.src = lastState;
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (!isDrawing) return;
  isDrawing = false;

  if (shapeTypeSelect.value !== "") {
    // Draw final shape
    drawShape(startX, startY, e.offsetX, e.offsetY, shapeTypeSelect.value, brushSizeInput.value, colorPicker.value);
  }

  saveState();
});

canvas.addEventListener("mouseout", () => {
  if (isDrawing) {
    isDrawing = false;
    saveState();
  }
});

// Undo/Redo/Clear buttons
undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);
clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
});

// Save & Save As
saveBtn.addEventListener("click", () => {
  const dataURL = canvas.toDataURL("image/png");
  downloadImage(dataURL, "mini-paint.png");
});

saveAsBtn.addEventListener("click", () => {
  const fileName = prompt("Enter file name:", "mini-paint.png");
  if (!fileName) return;
  const dataURL = canvas.toDataURL("image/png");
  downloadImage(dataURL, fileName);
});

function downloadImage(data, filename) {
  let a = document.createElement("a");
  a.href = data;
  a.download = filename;
  a.click();
}

// Sound on draw
function playSound() {
  if (sound.paused) {
    sound.currentTime = 0;
    sound.play();
  }
}

// Initialize canvas white bg and save initial blank state
function init() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  saveState();
}

init();
// Assume background color is white, adjust if different
const backgroundColor = "#ffffff"; 

// In your drawing logic where brushType is checked:
if (brushTypeSelect.value === "eraser") {
  ctx.globalAlpha = 1;
  ctx.strokeStyle = backgroundColor;
  ctx.lineWidth = brushSizeInput.value * 2; // thoda bada size for eraser
} else if (brushTypeSelect.value === "pencil") {
  // your normal pencil settings...
}
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;

  ctx.lineWidth = brushSizeInput.value;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (brushTypeSelect.value === "eraser") {
    ctx.strokeStyle = "#ffffff";  // Canvas background color
    ctx.globalAlpha = 1.0;
  } else if (brushTypeSelect.value === "marker") {
    ctx.strokeStyle = colorPicker.value;
    ctx.globalAlpha = 0.3;
  } else if (brushTypeSelect.value === "highlighter") {
    ctx.strokeStyle = colorPicker.value;
    ctx.globalAlpha = 0.15;
  } else {
    ctx.strokeStyle = colorPicker.value;
    ctx.globalAlpha = 1.0;
  }

  if (shapeTypeSelect.value === "") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
  }

  sound.currentTime = 0;
  sound.play();
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  const x = e.offsetX;
  const y = e.offsetY;

  if (shapeTypeSelect.value === "") {
    if (brushTypeSelect.value === "eraser") {
      ctx.lineWidth = brushSizeInput.value * 2; // Eraser thoda bada rakho
      ctx.globalAlpha = 1.0;
    } else if (brushTypeSelect.value === "pencil") {
      ctx.lineWidth = brushSizeInput.value / 2;
      ctx.globalAlpha = 1;
    } else if (brushTypeSelect.value === "marker") {
      ctx.lineWidth = brushSizeInput.value * 2;
      ctx.globalAlpha = 0.3;
    } else if (brushTypeSelect.value === "highlighter") {
      ctx.lineWidth = brushSizeInput.value * 3;
      ctx.globalAlpha = 0.15;
    } else {
      ctx.lineWidth = brushSizeInput.value;
      ctx.globalAlpha = 1;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (!isDrawing) return;
  isDrawing = false;
  saveState();
});
