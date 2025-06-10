 const sentences = [
      "Push yourself because no one else is going to do it for you.",
      "Dream it. Wish it. Do it.",
      "Hustle in silence and let your success make the noise.",
      "The harder you work for something, the greater you'll feel when you achieve it."
    ];

    const textDisplay = document.getElementById("text");
    const input = document.getElementById("input");
    const startBtn = document.getElementById("start");
    const result = document.getElementById("result");
    const timerEl = document.getElementById("timer");
    const voiceToggle = document.getElementById("voiceToggle");
    const historyBody = document.getElementById("historyBody");

    let currentSentence = "";
    let timer;
    let timeLeft = 60;
    let startTime;
    let recognition;

    function speak(text) {
      const synth = window.speechSynthesis;
      const utter = new SpeechSynthesisUtterance(text);
      synth.speak(utter);
    }

    function startVoiceTyping() {
      if (!('webkitSpeechRecognition' in window)) {
        alert("Voice typing not supported in your browser.");
        return;
      }
      recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.onresult = function(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript + ' ';
        }
        input.value += transcript.trim() + ' ';
      };
      recognition.start();
    }

    function stopVoiceTyping() {
      if (recognition) recognition.stop();
    }

    function startTest() {
      result.innerHTML = "";
      timeLeft = 60;
      startBtn.disabled = true;
      input.disabled = false;
      input.value = "";
      input.focus();
      currentSentence = sentences[Math.floor(Math.random() * sentences.length)];

      const selectedMode = document.querySelector('input[name="mode"]:checked').value;
      if (selectedMode === 'voice') {
        speak(currentSentence);
        textDisplay.innerText = "🎧 Listen & type the sentence you hear!";
      } else {
        textDisplay.innerText = `✍️ Type this: "${currentSentence}"`;
      }

      startTime = new Date();
      timerEl.innerText = `⏳ Timer: ${timeLeft} seconds`;

      if (voiceToggle.checked) startVoiceTyping();

      timer = setInterval(() => {
        timeLeft--;
        timerEl.innerText = `⏳ Timer: ${timeLeft} seconds`;
        if (timeLeft <= 0) {
          clearInterval(timer);
          stopVoiceTyping();
          endTest();
        }
      }, 1000);
    }

    function endTest() {
      input.disabled = true;
      startBtn.disabled = false;
      const typed = input.value;
      const endTime = new Date();
      const totalTime = (endTime - startTime) / 1000;
      const wordCount = typed.trim().split(/\s+/).length;
      const wpm = Math.round((wordCount / totalTime) * 60);

      let correct = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === currentSentence[i]) correct++;
      }
      const accuracy = Math.round((correct / currentSentence.length) * 100);

      result.innerHTML = `<h3>🏁 Results:</h3>
        🚀 Speed: <b>${wpm} WPM</b><br>
        🎯 Accuracy: <b>${accuracy}%</b>`;

      const date = new Date().toLocaleDateString();
      const row = `<tr><td>${wpm}</td><td>${accuracy}%</td><td>${date}</td></tr>`;
      historyBody.innerHTML += row;
    }

    startBtn.addEventListener("click", startTest);