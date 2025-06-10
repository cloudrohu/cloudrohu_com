const flashcard = document.getElementById('flashcard');
const front = flashcard.querySelector('.front');
const back = flashcard.querySelector('.back');
const translateBtn = document.getElementById('translateBtn');
const wordInput = document.getElementById('wordInput');
const languageSelect = document.getElementById('languageSelect');

const dictionary = {
  "hello": {
    "Hindi": "नमस्ते",
    "Korean": "안녕하세요",
    "Japanese": "こんにちは",
    "Thai": "สวัสดี"
  },
  "how are you": {
    "Hindi": "आप कैसे हैं?",
    "Korean": "어떻게 지내세요?",
    "Japanese": "お元気ですか？",
    "Thai": "คุณเป็นอย่างไรบ้าง?"
  },
  "what are you doing": {
    "Hindi": "आप क्या कर रहे हैं?",
    "Korean": "뭐 하고 있어요?",
    "Japanese": "何をしていますか？",
    "Thai": "คุณกำลังทำอะไรอยู่?"
  },
  "thank you": {
    "Hindi": "धन्यवाद",
    "Korean": "감사합니다",
    "Japanese": "ありがとう",
    "Thai": "ขอบคุณ"
  },
  "good night": {
    "Hindi": "शुभ रात्रि",
    "Korean": "안녕히 주무세요",
    "Japanese": "おやすみなさい",
    "Thai": "ราตรีสวัสดิ์"
  },
  "i love you": {
    "Hindi": "मैं तुमसे प्यार करता हूँ",
    "Korean": "사랑해요",
    "Japanese": "愛してる",
    "Thai": "ฉันรักคุณ"
  },
  "see you later": {
    "Hindi": "फिर मिलेंगे",
    "Korean": "나중에 봐요",
    "Japanese": "また後で",
    "Thai": "แล้วเจอกัน"
  },
  "what is your name": {
    "Hindi": "आपका नाम क्या है?",
    "Korean": "이름이 뭐예요?",
    "Japanese": "あなたの名前は何ですか？",
    "Thai": "คุณชื่ออะไร?"
  },
  "i am hungry": {
    "Hindi": "मुझे भूख लगी है",
    "Korean": "배고파요",
    "Japanese": "お腹がすいた",
    "Thai": "ฉันหิว"
  },
  "let's go": {
    "Hindi": "चलो चलते हैं",
    "Korean": "가자",
    "Japanese": "行こう",
    "Thai": "ไปกันเถอะ"
  }
};

translateBtn.addEventListener('click', () => {
  const word = wordInput.value.trim().toLowerCase();
  const lang = languageSelect.value;

  const translation = dictionary[word]?.[lang];

  if (translation) {
    front.textContent = word;
    back.textContent = translation;
    flashcard.classList.remove('flipped');
    setTimeout(() => {
      flashcard.classList.add('flipped');
    }, 100);
  } else {
    front.textContent = word;
    back.textContent = "Translation not found 😓";
    flashcard.classList.remove('flipped');
    setTimeout(() => {
      flashcard.classList.add('flipped');
    }, 100);
  }
});
