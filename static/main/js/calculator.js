// Elements
const calculatorContainer = document.getElementById('mainCalculator');
const gstSection = document.getElementById('gstSection');
const display = document.getElementById('display');
const gstAmount = document.getElementById('gstAmount');
const gstRate = document.getElementById('gstRate');
const gstResult = document.getElementById('gstResult');
const gstToggleBtn = document.getElementById('gstToggle');

// Toggle GST mode and Stylish Calculator
function toggleGST() {
  if (gstSection.classList.contains('hidden')) {
    // Show GST, hide calculator
    gstSection.classList.remove('hidden');
    calculatorContainer.style.display = 'none';
    gstToggleBtn.textContent = '🧮 Calculator Mode';
    clearDisplay();
  } else {
    // Show calculator, hide GST
    gstSection.classList.add('hidden');
    calculatorContainer.style.display = 'block';
    gstToggleBtn.textContent = '🧾 GST Mode';
    gstResult.textContent = '';
    gstAmount.value = '';
  }
}

// Append number to display
function appendNumber(num) {
  display.value += num;
}

// Append operator (+, -, *, /, %)
function appendOperator(op) {
  // Prevent operator if display is empty or last char is operator
  if (display.value === '') return;
  if (/[+\-*/%]$/.test(display.value)) {
    display.value = display.value.slice(0, -1) + op;
  } else {
    display.value += op;
  }
}

// Clear display
function clearDisplay() {
  display.value = '';
}

// Backspace last character
function backspace() {
  display.value = display.value.slice(0, -1);
}

// Calculate expression
function calculate() {
  try {
    // Replace unicode division and multiplication for eval safety if needed
    const expression = display.value.replace(/÷/g, '/').replace(/×/g, '*');
    let result = eval(expression);
    if (result === Infinity || result === -Infinity) {
      display.value = 'Error';
    } else {
      display.value = result;
      saveToHistory(expression + ' = ' + result);
    }
  } catch (e) {
    display.value = 'Error';
  }
}

// Save history in localStorage with timestamp
function saveToHistory(entry) {
  let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
  const now = Date.now();
  history.push({ entry, time: now });

  // Keep only last 2 days entries (172800000 ms = 2 days)
  history = history.filter(item => now - item.time < 172800000);

  localStorage.setItem('calcHistory', JSON.stringify(history));
  loadHistory();
}

// Load history to UI
function loadHistory() {
  const historyList = document.getElementById('historyList');
  let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
  historyList.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.entry;
    historyList.appendChild(li);
  });
}

// Copy history to clipboard
function copyHistory() {
  let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
  const text = history.map(item => item.entry).join('\n');
  navigator.clipboard.writeText(text).then(() => {
    alert('History copied to clipboard!');
  });
}

// Clear history from localStorage and UI
function clearHistory() {
  localStorage.removeItem('calcHistory');
  loadHistory();
}

// Export history as text file
function exportHistory() {
  let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
  const text = history.map(item => item.entry).join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'calculator_history.txt';
  a.click();
  URL.revokeObjectURL(a.href);
}

// GST Calculator function
function calculateGST() {
  const amount = parseFloat(gstAmount.value);
  const rate = parseFloat(gstRate.value);
  if (isNaN(amount)) {
    gstResult.textContent = 'Please enter a valid amount.';
    return;
  }
  const gstValue = (amount * rate) / 100;
  const total = amount + gstValue;
  gstResult.innerHTML = `
    <p>GST (${rate}%): ₹${gstValue.toFixed(2)}</p>
    <p>Total Amount: ₹${total.toFixed(2)}</p>
  `;
}

// Keyboard input handling ONLY when Stylish Calculator visible
document.addEventListener('keydown', function(event) {
  if (calculatorContainer.style.display === 'none') return;

  const key = event.key;
  if (key >= '0' && key <= '9') {
    appendNumber(key);
  } else if ('+-*/%'.includes(key)) {
    appendOperator(key);
  } else if (key === 'Enter') {
    event.preventDefault();
    calculate();
  } else if (key === 'Backspace') {
    backspace();
  } else if (key === 'Escape') {
    clearDisplay();
  }
});

// Initialize history on page load
window.onload = loadHistory;
