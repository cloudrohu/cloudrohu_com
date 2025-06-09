// Auto-load from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("webnotepad");
  if (saved) document.getElementById("notepad").value = saved;

  const theme = localStorage.getItem("theme");
  document.body.className = theme || "light";
});

document.getElementById("notepad").addEventListener("input", () => {
  localStorage.setItem("webnotepad", document.getElementById("notepad").value);
});

function newFile() {
  if (confirm("Start a new file? Unsaved changes will be lost.")) {
    document.getElementById('notepad').value = "";
    localStorage.removeItem("webnotepad");
  }
}

function openFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('notepad').value = e.target.result;
    localStorage.setItem("webnotepad", e.target.result);
  };
  reader.readAsText(file);
}

function saveFile() {
  const text = document.getElementById('notepad').value;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "untitled.txt";
  a.click();
  URL.revokeObjectURL(a.href);
}

function changeFont() {
  const font = document.getElementById("fontSelect").value;
  document.getElementById("notepad").style.fontFamily = font;
}

function toggleTheme() {
  const current = document.body.classList.contains("dark") ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  document.body.className = next;
  localStorage.setItem("theme", next);
  document.getElementById("themeToggle").textContent = next === "dark" ? "☀️" : "🌙";
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const text = document.getElementById('notepad').value;
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 10);
  doc.save("note.pdf");
}

function printNote() {
  const content = document.getElementById("notepad").value;
  const w = window.open();
  w.document.write("<pre>" + content.replace(/</g, "&lt;") + "</pre>");
  w.document.close();
  w.print();
}
function startSpeech() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech Recognition not supported in your browser.");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    const note = document.getElementById("notepad");
    note.value += " " + text;
    localStorage.setItem("webnotepad", note.value);
  };
}
function toggleMarkdown() {
  const note = document.getElementById("notepad");
  const preview = document.getElementById("preview");
  if (preview.style.display === "none") {
    preview.innerHTML = marked.parse(note.value);
    preview.style.display = "block";
    note.style.display = "none";
  } else {
    preview.style.display = "none";
    note.style.display = "block";
  }
}
function encryptNote() {
  const pass = prompt("Enter a password to encrypt this note:");
  if (!pass) return;

  const content = document.getElementById("notepad").value;
  const encrypted = CryptoJS.AES.encrypt(content, pass).toString();

  const decrypted = prompt("Re-enter password to decrypt:");
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, decrypted);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error();

    document.getElementById("notepad").value = originalText;
    localStorage.setItem("webnotepad", originalText);
    alert("Encryption + Decryption successful ✅");
  } catch {
    alert("Wrong password! 🔒");
  }
}
