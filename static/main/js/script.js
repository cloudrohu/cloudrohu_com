const wheelCanvas = document.getElementById("colorWheel");
const satCanvas = document.getElementById("saturation");
const colorPreview = document.getElementById("colorPreview");
const hexValue = document.getElementById("hexValue");
const rgbValue = document.getElementById("rgbValue");
const hslValue = document.getElementById("hslValue");

const wheelCtx = wheelCanvas.getContext("2d");
const satCtx = satCanvas.getContext("2d");

let selectedHue = 0;
let selectedSat = 1;
let selectedLight = 0.5;
let wheelSelector = { x: wheelCanvas.width / 2, y: wheelCanvas.height / 2 };

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function RGBToHSL(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [h, s * 100, l * 100];
}

function drawColorWheel() {
  const radius = wheelCanvas.width / 2;
  const image = wheelCtx.createImageData(wheelCanvas.width, wheelCanvas.height);
  const data = image.data;

  for (let y = -radius; y < radius; y++) {
    for (let x = -radius; x < radius; x++) {
      const dx = x;
      const dy = y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const hue = (angle + 360) % 360;
      const sat = distance / radius;

      if (sat <= 1) {
        const [r, g, b] = hslToRgb(hue, sat * 100, 50);
        const index = ((y + radius) * wheelCanvas.width + (x + radius)) * 4;
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255;
      }
    }
  }
  wheelCtx.putImageData(image, 0, 0);
}

function drawSatSlider(hue) {
  const gradient = satCtx.createLinearGradient(0, 0, satCanvas.width, 0);
  for (let i = 0; i <= 100; i++) {
    const [r, g, b] = hslToRgb(hue, i, 50);
    gradient.addColorStop(i / 100, `rgb(${r}, ${g}, ${b})`);
  }
  satCtx.fillStyle = gradient;
  satCtx.fillRect(0, 0, satCanvas.width, satCanvas.height);
}

function updateColor(r, g, b) {
  const [h, s, l] = RGBToHSL(r, g, b);
  colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  hexValue.textContent = rgbToHex(r, g, b);
  rgbValue.textContent = `${r}, ${g}, ${b}`;
  hslValue.textContent = `${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%`;
}

function drawSelectorCircle() {
  const radius = wheelCanvas.width / 2;
  const centerX = radius;
  const centerY = radius;

  // Clear previous selector circle
  wheelCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
  drawColorWheel();

  // Draw small circle at selector position
  wheelCtx.beginPath();
  wheelCtx.strokeStyle = "#000";
  wheelCtx.lineWidth = 3;
  wheelCtx.shadowColor = "rgba(0,0,0,0.3)";
  wheelCtx.shadowBlur = 4;
  wheelCtx.arc(wheelSelector.x, wheelSelector.y, 8, 0, Math.PI * 2);
  wheelCtx.stroke();
}

function pickColorFromWheel(e) {
  const rect = wheelCanvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  const radius = wheelCanvas.width / 2;
  const dx = x - radius;
  const dy = y - radius;
  const dist = Math.sqrt(dx*dx + dy*dy);

  if(dist > radius) return;  // Outside the wheel, ignore

  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  selectedHue = (angle + 360) % 360;
  selectedSat = dist / radius;

  wheelSelector.x = x;
  wheelSelector.y = y;

  drawSatSlider(selectedHue);

  const [r, g, b] = hslToRgb(selectedHue, selectedSat * 100, selectedLight * 100);
  updateColor(r, g, b);
  drawSelectorCircle();
}

function pickColorFromSat(e) {
  const x = e.offsetX;
  const sat = x / satCanvas.width;
  selectedLight = 0.5; // You can add lightness slider if want later
  selectedSat = sat;

  const [r, g, b] = hslToRgb(selectedHue, sat * 100, selectedLight * 100);
  updateColor(r, g, b);
}

drawColorWheel();
drawSatSlider(selectedHue);
drawSelectorCircle();

let isPickingWheel = false;
let isPickingSat = false;

wheelCanvas.addEventListener("mousedown", e => {
  isPickingWheel = true;
  pickColorFromWheel(e);
});
wheelCanvas.addEventListener("mousemove", e => {
  if (isPickingWheel) pickColorFromWheel(e);
});
wheelCanvas.addEventListener("mouseup", e => {
  isPickingWheel = false;
});
wheelCanvas.addEventListener("mouseleave", e => {
  isPickingWheel = false;
});

satCanvas.addEventListener("mousedown", e => {
  isPickingSat = true;
  pickColorFromSat(e);
});
satCanvas.addEventListener("mousemove", e => {
  if (isPickingSat) pickColorFromSat(e);
});
satCanvas.addEventListener("mouseup", e => {
  isPickingSat = false;
});
satCanvas.addEventListener("mouseleave", e => {
  isPickingSat = false;
});
let satSliderActive = false;  // new flag

// ... baaki code same

function drawSatSlider(hue, saturation = 100, drawCircle = true) {
  const width = satCanvas.width;
  const height = satCanvas.height;

  // Draw gradient
  const gradient = satCtx.createLinearGradient(0, 0, width, 0);
  for (let i = 0; i <= 100; i++) {
    const [r, g, b] = hslToRgb(hue, i, 50);
    gradient.addColorStop(i / 100, `rgb(${r},${g},${b})`);
  }
  satCtx.fillStyle = gradient;
  satCtx.fillRect(0, 0, width, height);

  if (drawCircle) {
    const x = (saturation / 100) * width;
    const y = height / 2;

    satCtx.beginPath();
    satCtx.arc(x, y, 8, 0, 2 * Math.PI);
    satCtx.strokeStyle = "#222";
    satCtx.lineWidth = 2;
    satCtx.fillStyle = "#fff";
    satCtx.fill();
    satCtx.stroke();
  }

  // Saturation percentage text
  satCtx.font = "14px Segoe UI, sans-serif";
  satCtx.fillStyle = "#222";
  satCtx.textAlign = "center";
  satCtx.fillText(`${Math.round(saturation)}%`, width / 2, height + 20);
}

// Modify updateColor to optionally NOT move circle if satSliderActive is false
function updateColor(r, g, b) {
  const [h, s, l] = RGBToHSL(r, g, b);
  selectedHue = h;
  selectedSat = s;
  colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  hexValue.textContent = rgbToHex(r, g, b);
  rgbValue.textContent = `${r}, ${g}, ${b}`;
  hslValue.textContent = `${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%`;

  // Draw slider circle only if slider is active (dragging), else draw gradient only
  drawSatSlider(selectedHue, selectedSat, satSliderActive);
}

// Slider event listeners
satCanvas.addEventListener("mousedown", e => {
  satSliderActive = true;
  pickColorFromSat(e);
});
satCanvas.addEventListener("mousemove", e => {
  if (satSliderActive) pickColorFromSat(e);
});
satCanvas.addEventListener("mouseup", e => {
  satSliderActive = false;
  // After drag ends, draw with circle at last position
  drawSatSlider(selectedHue, selectedSat, true);
});
satCanvas.addEventListener("mouseleave", e => {
  satSliderActive = false;
  drawSatSlider(selectedHue, selectedSat, true);
});

// Wheel events remain same, but updateColor will NOT move slider circle if satSliderActive is false
wheelCanvas.addEventListener("mousedown", e => {
  isPickingWheel = true;
  pickColorFromWheel(e);
});
wheelCanvas.addEventListener("mousemove", e => {
  if (isPickingWheel) pickColorFromWheel(e);
});
wheelCanvas.addEventListener("mouseup", e => {
  isPickingWheel = false;
});
wheelCanvas.addEventListener("mouseleave", e => {
  isPickingWheel = false;a
});

// pickColorFromWheel and pickColorFromSat remain same


  document.addEventListener('DOMContentLoaded', function () {
    const moreText = document.getElementById('more-text');
    const toggleBtn = document.getElementById('toggle-btn');

    toggleBtn.addEventListener('click', function () {
      if (moreText.classList.contains('hidden')) {
        moreText.classList.remove('hidden');
        toggleBtn.textContent = 'Read Less';
      } else {
        moreText.classList.add('hidden');
        toggleBtn.textContent = 'Read More';
      }
    });
  });
 // Typing animation
  const text = "Grow Your Business With Smart Financial Strategy";
  let index = 0;
  function typeWriter() {
    const target = document.getElementById("typing-text");
    if (index < text.length) {
      target.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeWriter, 40);
    }
  }
  document.addEventListener("DOMContentLoaded", typeWriter);

  // Scroll Reveal
  window.addEventListener("scroll", function () {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 100;

      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      }
    }
  });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  // Use Intersection Observer for fade-in effect on scroll
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  observer.observe(section);
});
  
 // Basic form validation & alert
    document.getElementById('contactForm').addEventListener('submit', function(e){
      e.preventDefault();
      const form = e.target;
      if(!form.checkValidity()){
        alert('Please fill all fields correctly.');
        return;
      }
      alert('Thank you for contacting Findexor! We will get back to you soon.');
      form.reset();
    });

