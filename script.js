/**
 * AI Language Translator
 * Demo dictionary (100+ EN↔HI phrases) + MyMemory Translation API
 * Pure vanilla JavaScript — no backend required
 */

/* ============================================
   DOM Elements
   ============================================ */
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const translateBtn = document.getElementById('translateBtn');
const swapBtn = document.getElementById('swapBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const speakBtn = document.getElementById('speakBtn');
const micBtn = document.getElementById('micBtn');
const charCount = document.getElementById('charCount');
const loadingOverlay = document.getElementById('loadingOverlay');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

/* ============================================
   Language Labels (for history display)
   ============================================ */
const LANG_NAMES = {
  en: 'English',
  hi: 'Hindi',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  ja: 'Japanese',
  zh: 'Chinese'
};

/* ============================================
   Demo Dictionary — 100+ English ↔ Hindi
   Keys are lowercase English; values are Hindi.
   Reverse lookup built at runtime.
   ============================================ */
const DEMO_DICTIONARY = {
  // Greetings & Basics
  'hello': 'नमस्ते',
  'hi': 'नमस्ते',
  'good morning': 'सुप्रभात',
  'good afternoon': 'शुभ दोपहर',
  'good evening': 'शुभ संध्या',
  'good night': 'शुभ रात्रि',
  'goodbye': 'अलविदा',
  'bye': 'अलविदा',
  'see you later': 'फिर मिलेंगे',
  'welcome': 'स्वागत है',
  'thank you': 'धन्यवाद',
  'thanks': 'धन्यवाद',
  'please': 'कृपया',
  'sorry': 'माफ़ कीजिए',
  'excuse me': 'माफ़ कीजिए',
  'yes': 'हाँ',
  'no': 'नहीं',
  'okay': 'ठीक है',
  'ok': 'ठीक है',
  'maybe': 'शायद',
  'of course': 'बिल्कुल',

  // Questions & Conversation
  'how are you': 'आप कैसे हैं',
  'how are you?': 'आप कैसे हैं?',
  'i am fine': 'मैं ठीक हूँ',
  'i am fine, thank you': 'मैं ठीक हूँ, धन्यवाद',
  'what is your name': 'आपका नाम क्या है',
  'what is your name?': 'आपका नाम क्या है?',
  'my name is': 'मेरा नाम है',
  'nice to meet you': 'आपसे मिलकर अच्छा लगा',
  'where are you from': 'आप कहाँ से हैं',
  'where are you from?': 'आप कहाँ से हैं?',
  'i am from india': 'मैं भारत से हूँ',
  'do you speak english': 'क्या आप अंग्रेज़ी बोलते हैं',
  'do you speak hindi': 'क्या आप हिंदी बोलते हैं',
  'i do not understand': 'मुझे समझ नहीं आया',
  'can you help me': 'क्या आप मेरी मदद कर सकते हैं',
  'can you help me?': 'क्या आप मेरी मदद कर सकते हैं?',
  'what time is it': 'क्या समय हुआ है',
  'what time is it?': 'क्या समय हुआ है?',

  // Common Words
  'water': 'पानी',
  'food': 'खाना',
  'home': 'घर',
  'house': 'घर',
  'family': 'परिवार',
  'friend': 'दोस्त',
  'love': 'प्यार',
  'work': 'काम',
  'school': 'स्कूल',
  'book': 'किताब',
  'pen': 'कलम',
  'money': 'पैसा',
  'time': 'समय',
  'day': 'दिन',
  'night': 'रात',
  'morning': 'सुबह',
  'today': 'आज',
  'tomorrow': 'कल',
  'yesterday': 'कल',
  'week': 'सप्ताह',
  'month': 'महीना',
  'year': 'साल',
  'world': 'दुनिया',
  'country': 'देश',
  'city': 'शहर',
  'road': 'सड़क',
  'car': 'कार',
  'bus': 'बस',
  'train': 'ट्रेन',
  'phone': 'फ़ोन',
  'computer': 'कंप्यूटर',
  'internet': 'इंटरनेट',

  // Numbers
  'one': 'एक',
  'two': 'दो',
  'three': 'तीन',
  'four': 'चार',
  'five': 'पाँच',
  'six': 'छह',
  'seven': 'सात',
  'eight': 'आठ',
  'nine': 'नौ',
  'ten': 'दस',
  'hundred': 'सौ',
  'thousand': 'हज़ार',

  // Colors
  'red': 'लाल',
  'blue': 'नीला',
  'green': 'हरा',
  'yellow': 'पीला',
  'white': 'सफ़ेद',
  'black': 'काला',
  'orange': 'नारंगी',
  'purple': 'बैंगनी',

  // Emotions & Adjectives
  'happy': 'खुश',
  'sad': 'दुखी',
  'angry': 'गुस्सा',
  'beautiful': 'सुंदर',
  'good': 'अच्छा',
  'bad': 'बुरा',
  'big': 'बड़ा',
  'small': 'छोटा',
  'hot': 'गर्म',
  'cold': 'ठंडा',
  'new': 'नया',
  'old': 'पुराना',
  'fast': 'तेज़',
  'slow': 'धीमा',
  'easy': 'आसान',
  'difficult': 'कठिन',

  // Actions & Verbs
  'eat': 'खाना',
  'drink': 'पीना',
  'sleep': 'सोना',
  'walk': 'चलना',
  'run': 'दौड़ना',
  'read': 'पढ़ना',
  'write': 'लिखना',
  'speak': 'बोलना',
  'listen': 'सुनना',
  'watch': 'देखना',
  'learn': 'सीखना',
  'teach': 'पढ़ाना',
  'buy': 'खरीदना',
  'sell': 'बेचना',
  'come': 'आना',
  'go': 'जाना',
  'give': 'देना',
  'take': 'लेना',
  'open': 'खोलना',
  'close': 'बंद करना',

  // Common Sentences
  'i love you': 'मैं तुमसे प्यार करता हूँ',
  'how much does this cost': 'इसकी कीमत कितनी है',
  'how much does this cost?': 'इसकी कीमत कितनी है?',
  'where is the bathroom': 'बाथरूम कहाँ है',
  'where is the bathroom?': 'बाथरूम कहाँ है?',
  'i am hungry': 'मुझे भूख लगी है',
  'i am thirsty': 'मुझे प्यास लगी है',
  'i am tired': 'मैं थक गया हूँ',
  'i am lost': 'मैं खो गया हूँ',
  'help': 'मदद',
  'stop': 'रुको',
  'wait': 'इंतज़ार करो',
  'hurry up': 'जल्दी करो',
  'be careful': 'सावधान रहो',
  'good luck': 'शुभकामनाएँ',
  'congratulations': 'बधाई हो',
  'happy birthday': 'जन्मदिन मुबारक',
  'merry christmas': 'क्रिसमस की शुभकामनाएँ',
  'happy new year': 'नव वर्ष की शुभकामनाएँ',

  // Technology & Modern
  'artificial intelligence': 'कृत्रिम बुद्धिमत्ता',
  'machine learning': 'मशीन लर्निंग',
  'translation': 'अनुवाद',
  'language': 'भाषा',
  'translate this': 'इसका अनुवाद करो',
  'download': 'डाउनलोड',
  'upload': 'अपलोड',
  'password': 'पासवर्ड',
  'email': 'ईमेल',
  'website': 'वेबसाइट',
  'application': 'एप्लिकेशन',
  'software': 'सॉफ़्टवेयर',
  'developer': 'डेवलपर',
  'student': 'छात्र',
  'teacher': 'शिक्षक',
  'doctor': 'डॉक्टर',
  'engineer': 'इंजीनियर',

  // Travel & Directions
  'left': 'बाएँ',
  'right': 'दाएँ',
  'straight': 'सीधे',
  'near': 'पास',
  'far': 'दूर',
  'airport': 'हवाई अड्डा',
  'hotel': 'होटल',
  'restaurant': 'रेस्तराँ',
  'hospital': 'अस्पताल',
  'police station': 'पुलिस स्टेशन',
  'ticket': 'टिकट',
  'passport': 'पासपोर्ट',
  'map': 'नक्शा',

  // Weather & Nature
  'sun': 'सूरज',
  'moon': 'चाँद',
  'star': 'तारा',
  'rain': 'बारिश',
  'snow': 'बर्फ',
  'wind': 'हवा',
  'tree': 'पेड़',
  'flower': 'फूल',
  'river': 'नदी',
  'mountain': 'पहाड़',
  'ocean': 'महासागर',
  'sky': 'आसमान',

  // Food
  'breakfast': 'नाश्ता',
  'lunch': 'दोपहर का खाना',
  'dinner': 'रात का खाना',
  'bread': 'रोटी',
  'rice': 'चावल',
  'milk': 'दूध',
  'tea': 'चाय',
  'coffee': 'कॉफ़ी',
  'fruit': 'फल',
  'vegetable': 'सब्ज़ी',
  'meat': 'मांस',
  'sugar': 'चीनी',
  'salt': 'नमक',

  // India-specific
  'india': 'भारत',
  'delhi': 'दिल्ली',
  'mumbai': 'मुंबई',
  'namaste': 'नमस्ते',
  'thank you very much': 'बहुत-बहुत धन्यवाद',
  'what is this': 'यह क्या है',
  'what is this?': 'यह क्या है?',
  'i need help': 'मुझे मदद चाहिए',
  'call the police': 'पुलिस को बुलाओ',
  'i am a student': 'मैं एक छात्र हूँ',
  'i am learning hindi': 'मैं हिंदी सीख रहा हूँ',
  'this is beautiful': 'यह सुंदर है',
  'i agree': 'मैं सहमत हूँ',
  'i disagree': 'मैं असहमत हूँ',
  'see you tomorrow': 'कल मिलते हैं',
  'have a nice day': 'आपका दिन शुभ हो',
  'take care': 'अपना ख्याल रखना',
  'god bless you': 'भगवान आपका भला करे'
};

/** Build reverse dictionary (Hindi → English) for demo lookups */
const DEMO_REVERSE = {};
for (const [en, hi] of Object.entries(DEMO_DICTIONARY)) {
  DEMO_REVERSE[hi.toLowerCase()] = en;
}

/* ============================================
   State
   ============================================ */
let translationHistory = JSON.parse(localStorage.getItem('translationHistory') || '[]');
let recognition = null;
let isListening = false;

/* ============================================
   Initialization
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSpeechRecognition();
  renderHistory();
  autoResizeTextarea(inputText);
  updateCharCount();
});

/* ============================================
   Theme Toggle (Dark / Light)
   ============================================ */
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');

  if (isLight) {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else {
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  }
});

/* ============================================
   Character Counter & Auto-resize
   ============================================ */
function updateCharCount() {
  charCount.textContent = inputText.value.length;
}

function autoResizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 400) + 'px';
}

inputText.addEventListener('input', () => {
  updateCharCount();
  autoResizeTextarea(inputText);
});

outputText.addEventListener('input', () => {
  autoResizeTextarea(outputText);
});

/* ============================================
   Swap Languages
   ============================================ */
swapBtn.addEventListener('click', () => {
  const tempLang = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = tempLang;

  const tempText = inputText.value;
  inputText.value = outputText.value;
  outputText.value = tempText;

  updateCharCount();
  autoResizeTextarea(inputText);
  autoResizeTextarea(outputText);
});

/* ============================================
   Clear Input
   ============================================ */
clearBtn.addEventListener('click', () => {
  inputText.value = '';
  outputText.value = '';
  updateCharCount();
  autoResizeTextarea(inputText);
  autoResizeTextarea(outputText);
  inputText.focus();
});

/* ============================================
   Copy Output
   ============================================ */
copyBtn.addEventListener('click', async () => {
  const text = outputText.value.trim();
  if (!text) {
    showToast('Nothing to copy!', true);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  } catch {
    /* Fallback for older browsers */
    outputText.select();
    document.execCommand('copy');
    showToast('Copied to clipboard!');
  }
});

/* ============================================
   Text-to-Speech (Web Speech API)
   ============================================ */
speakBtn.addEventListener('click', () => {
  const text = outputText.value.trim();
  if (!text) {
    showToast('Nothing to speak!', true);
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getSpeechLangCode(targetLang.value);
  utterance.rate = 0.9;
  utterance.pitch = 1;

  utterance.onerror = () => showToast('Speech not supported for this language.', true);
  window.speechSynthesis.speak(utterance);
});

/** Map app lang codes to BCP-47 speech codes */
function getSpeechLangCode(code) {
  const map = {
    en: 'en-US',
    hi: 'hi-IN',
    fr: 'fr-FR',
    es: 'es-ES',
    de: 'de-DE',
    ja: 'ja-JP',
    zh: 'zh-CN'
  };
  return map[code] || 'en-US';
}

/* ============================================
   Speech Recognition (Microphone)
   ============================================ */
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    micBtn.title = 'Speech recognition not supported';
    micBtn.style.opacity = '0.5';
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('active');
    showToast('Listening... Speak now.');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputText.value = inputText.value
      ? inputText.value + ' ' + transcript
      : transcript;
    updateCharCount();
    autoResizeTextarea(inputText);
  };

  recognition.onerror = (event) => {
    showToast(`Microphone error: ${event.error}`, true);
    stopListening();
  };

  recognition.onend = () => stopListening();
}

function stopListening() {
  isListening = false;
  micBtn.classList.remove('active');
}

micBtn.addEventListener('click', () => {
  if (!recognition) {
    showToast('Speech recognition not supported in this browser.', true);
    return;
  }

  if (isListening) {
    recognition.stop();
    stopListening();
    return;
  }

  recognition.lang = getSpeechLangCode(sourceLang.value);
  recognition.start();
});

/* ============================================
   Translate — Main Logic
   ============================================ */
translateBtn.addEventListener('click', handleTranslate);
inputText.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) handleTranslate();
});

async function handleTranslate() {
  const text = inputText.value.trim();
  const src = sourceLang.value;
  const tgt = targetLang.value;

  if (!text) {
    showToast('Please enter text to translate.', true);
    inputText.focus();
    return;
  }

  if (src === tgt) {
    showToast('Source and target languages must be different.', true);
    return;
  }

  translateBtn.disabled = true;
  showLoading(true);
  outputText.value = '';

  /* Simulate AI processing delay (1–2 seconds) */
  const delay = 1000 + Math.random() * 1000;
  await sleep(delay);

  try {
    let result = lookupDemoDictionary(text, src, tgt);

    if (!result) {
      result = await fetchMyMemoryTranslation(text, src, tgt);
    }

    outputText.value = result;
    autoResizeTextarea(outputText);
    addToHistory(text, result, src, tgt);
  } catch (err) {
    outputText.value = '';
    showToast(err.message || 'Translation failed. Please try again.', true);
  } finally {
    showLoading(false);
    translateBtn.disabled = false;
  }
}

/**
 * Check demo dictionary for exact match (EN↔HI only)
 */
function lookupDemoDictionary(text, src, tgt) {
  const normalized = text.toLowerCase().trim();

  if (src === 'en' && tgt === 'hi') {
    return DEMO_DICTIONARY[normalized] || null;
  }

  if (src === 'hi' && tgt === 'en') {
    return DEMO_REVERSE[normalized] || null;
  }

  return null;
}

/**
 * Call MyMemory Translation API (free, no API key)
 * Docs: https://mymemory.translated.net/doc/spec.php
 */
async function fetchMyMemoryTranslation(text, src, tgt) {
  const langPair = `${src}|${tgt}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error('Network error. Check your internet connection.');
  }

  if (!response.ok) {
    throw new Error('Translation service is temporarily unavailable.');
  }

  const data = await response.json();

  if (data.responseStatus !== 200) {
    throw new Error(
      data.responseDetails ||
      'Translation not available. Please try different text or languages.'
    );
  }

  const translated = data.responseData?.translatedText?.trim();

  if (!translated) {
    throw new Error('Translation not available in demo mode.');
  }

  /* MyMemory sometimes echoes the source when it can't translate */
  if (translated.toLowerCase() === text.toLowerCase() && src !== tgt) {
    throw new Error('Translation not available in demo mode.');
  }

  return translated;
}

/* ============================================
   Loading Overlay
   ============================================ */
function showLoading(show) {
  loadingOverlay.classList.toggle('visible', show);
  loadingOverlay.setAttribute('aria-hidden', String(!show));
}

/* ============================================
   Toast Notifications
   ============================================ */
let toastTimeout;

function showToast(message, isError = false) {
  toastMessage.textContent = message;
  toast.classList.toggle('error', isError);
  toast.querySelector('i').className = isError
    ? 'fas fa-exclamation-circle'
    : 'fas fa-check-circle';

  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ============================================
   Translation History (last 5)
   ============================================ */
function addToHistory(source, result, src, tgt) {
  const entry = {
    source,
    result,
    src,
    tgt,
    timestamp: Date.now()
  };

  translationHistory.unshift(entry);
  translationHistory = translationHistory.slice(0, 5);
  localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
  renderHistory();
}

function renderHistory() {
  if (translationHistory.length === 0) {
    historyList.innerHTML =
      '<li class="history-empty">No translations yet. Try translating something!</li>';
    return;
  }

  historyList.innerHTML = translationHistory
    .map(
      (item, i) => `
      <li class="history-item" data-index="${i}" tabindex="0" role="button">
        <span class="history-langs">${LANG_NAMES[item.src]} → ${LANG_NAMES[item.tgt]}</span>
        <span class="history-text">${escapeHtml(item.source)}</span>
        <span class="history-result">${escapeHtml(item.result)}</span>
      </li>`
    )
    .join('');

  historyList.querySelectorAll('.history-item').forEach((el) => {
    el.addEventListener('click', () => loadHistoryItem(Number(el.dataset.index)));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadHistoryItem(Number(el.dataset.index));
      }
    });
  });
}

function loadHistoryItem(index) {
  const item = translationHistory[index];
  if (!item) return;

  sourceLang.value = item.src;
  targetLang.value = item.tgt;
  inputText.value = item.source;
  outputText.value = item.result;
  updateCharCount();
  autoResizeTextarea(inputText);
  autoResizeTextarea(outputText);
}

clearHistoryBtn.addEventListener('click', () => {
  translationHistory = [];
  localStorage.removeItem('translationHistory');
  renderHistory();
  showToast('History cleared.');
});

/* ============================================
   Utilities
   ============================================ */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
