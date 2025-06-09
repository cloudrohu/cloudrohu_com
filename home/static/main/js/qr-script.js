const input = document.getElementById('text');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrcodeDiv = document.getElementById('qrcode');

// Apna logo image path yahan daalo (static file URL)
const logoPath = 'http://127.0.0.1:8000/static/main/images/bg_remove%20logo.png';

let canvas;

generateBtn.addEventListener('click', () => {
  const value = input.value.trim();
  if (!value) {
    alert('Please enter a URL or text to generate QR code');
    return;
  }

  qrcodeDiv.innerHTML = '';  // Purana QR hatao
  canvas = document.createElement('canvas');
  canvas.width = 280;
  canvas.height = 280;
  qrcodeDiv.appendChild(canvas);

  QRCode.toCanvas(canvas, value, {
    errorCorrectionLevel: 'H',
    width: 280,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  }, error => {
    if (error) {
      alert('Failed to generate QR code: ' + error);
      return;
    }
    addLogoToCanvas();
    downloadBtn.disabled = false;
  });
});

function addLogoToCanvas() {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = logoPath;
  img.crossOrigin = "anonymous";  // Canvas pe image draw ke liye zaroori
  img.onload = () => {
    const size = canvas.width * 0.3; // Logo size = 30% of QR canvas
    const x = (canvas.width - size) / 2;
    const y = (canvas.height - size) / 2;

    // White rounded square background for logo
    const radius = 20;
    ctx.fillStyle = 'white';
    roundRect(ctx, x - 10, y - 10, size + 20, size + 20, radius);
    ctx.fill();

    // Logo draw karo
    ctx.drawImage(img, x, y, size, size);
  };
  img.onerror = () => {
    alert('Error loading logo image from ' + logoPath);
  };
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

downloadBtn.addEventListener('click', () => {
  if (!canvas) return;

  let fileName = input.value.trim();
  if (!fileName) {
    fileName = 'qr-code';
  } else {
    // Special characters aur spaces ko underscore me badal do
    fileName = fileName.replace(/[^a-zA-Z0-9-_]/g, '_');
  }

  const link = document.createElement('a');
  link.download = fileName + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
