

// Anuvadini.ai Voice & Multilingual AI Translation Engine

export class AnuvadiniVoiceEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis || null : null;
    this.recognition = null;
    this.isListening = false;
    this.cachedVoices = [];
    if (this.synth) {
      this.cachedVoices = this.synth.getVoices() || [];
      if (typeof window !== 'undefined' && 'onvoiceschanged' in this.synth) {
        this.synth.onvoiceschanged = () => {
          this.cachedVoices = this.synth.getVoices() || [];
        };
      }
    }
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (e) {
        console.warn('SpeechRecognition init error:', e);
      }
    }
  }

  startListening(languageCode = 'EN', onResult, onError, onEnd) {
    const SpeechRecognition = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;

    if (!SpeechRecognition) {
      console.log('[VOICE] error', 'browser unsupported');
      if (onError) onError('Speech recognition is not supported in this browser. Please try Google Chrome, Microsoft Edge, or Safari.', 'unsupported');
      return;
    }

    // Stop any ongoing Text-to-Speech output so speaker audio doesn't interfere with mic
    stopDoorlynSpeech();

    // Clean up previous recognition session to prevent session locks
    try {
      if (this.recognition) {
        this.recognition.abort();
      }
    } catch {}

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    const langMap = {
      EN: 'en-IN',
      HI: 'hi-IN',
      TE: 'te-IN'
    };

    const targetLang = langMap[languageCode] || 'en-IN';
    this.recognition.lang = targetLang;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('[VOICE] started');
      console.log('[VOICE] listening', { lang: targetLang });
    };

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      transcript = transcript.trim();
      if (transcript) {
        console.log('[VOICE] transcript', transcript);
        if (onResult && transcript) onResult(transcript);
      }
    };

    this.recognition.onerror = (err) => {
      console.log('[VOICE] error', err.error);
      this.isListening = false;
      if (this.activeStream) {
        try { this.activeStream.getTracks().forEach(track => track.stop()); } catch {}
        this.activeStream = null;
      }

      let userFriendlyMsg = `Microphone error (${err.error}).`;
      if (err.error === 'not-allowed' || err.error === 'permission-denied') {
        userFriendlyMsg = 'Microphone access denied! Please click the 🔒 icon next to the website URL in your browser address bar to allow Microphone permissions.';
      } else if (err.error === 'no-speech') {
        userFriendlyMsg = 'No speech detected. Please tap the mic icon and speak clearly.';
      } else if (err.error === 'audio-capture') {
        userFriendlyMsg = 'No microphone device detected. Please connect a microphone to your system.';
      } else if (err.error === 'network') {
        userFriendlyMsg = 'Speech recognition network error. Please check your internet connection.';
      }

      if (onError) onError(userFriendlyMsg, err.error);
    };

    this.recognition.onend = () => {
      console.log('[VOICE] stopped');
      this.isListening = false;
      if (this.activeStream) {
        try { this.activeStream.getTracks().forEach(track => track.stop()); } catch {}
        this.activeStream = null;
      }
      if (onEnd) onEnd();
    };

    const beginListening = () => {
      try {
        this.recognition.start();
      } catch (e) {
        console.log('[VOICE] error', e.message);
        this.isListening = false;
        if (onError) onError('Could not start microphone listening: ' + e.message, 'start-error');
      }
    };

    // Prompt for microphone permission if necessary, then start speech recognition directly
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          // Keep stream track active during speech recognition session and stop track on end
          this.activeStream = stream;
          beginListening();
        })
        .catch((micErr) => {
          console.log('[VOICE] error', micErr.name || micErr.message);
          this.isListening = false;
          if (onError) onError('Microphone access denied. Please click the 🔒 lock icon near the site URL to grant Microphone access.', 'permission-denied');
        });
    } else {
      beginListening();
    }
  }

  stopListening() {
    if (this.activeStream) {
      try {
        this.activeStream.getTracks().forEach(track => track.stop());
      } catch {}
      this.activeStream = null;
    }
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }

  stopSpeaking() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.log('Speech cancel error:', e);
      }
    }
  }

  getFemaleVoice(languageCode = 'EN') {
    let voices = this.cachedVoices;
    if (!voices || voices.length === 0) {
      voices = this.synth ? this.synth.getVoices() || [] : [];
      this.cachedVoices = voices;
    }

    if (!voices || voices.length === 0) return null;

    const femaleKeywords = [
      'female', 'woman', 'girl', 'neerja', 'heera', 'swara', 'shruti', 'kalpana',
      'ananya', 'priya', 'veena', 'zira', 'jenny', 'aria', 'samantha', 'victoria',
      'karen', 'moira', 'tessa', 'fiona', 'siri', 'sangeeta', 'aditi', 'lekha', 'geeta',
      'kavya', 'pallavi', 'anjali', 'shreya', 'sunita', 'natural'
    ];

    const maleKeywords = [
      'male', 'man', 'boy', 'david', 'mark', 'george', 'ravi', 'mohan', 'madhav',
      'guy', 'daniel', 'oliver', 'rishi', 'hemant', 'ajay', 'rahul'
    ];

    const isFemale = (v) => {
      const name = (v.name || '').toLowerCase();
      const hasFemale = femaleKeywords.some(kw => name.includes(kw));
      const hasMale = maleKeywords.some(kw => name.includes(kw));
      return hasFemale && !hasMale;
    };

    const isNotExplicitlyMale = (v) => {
      const name = (v.name || '').toLowerCase();
      return !maleKeywords.some(kw => name.includes(kw));
    };

    // 1. Language specific matching
    if (languageCode === 'TE') {
      const teFemale = voices.find(v => (v.lang.includes('te') || v.name.toLowerCase().includes('telugu')) && isFemale(v));
      if (teFemale) return teFemale;

      const teAny = voices.find(v => (v.lang.includes('te') || v.name.toLowerCase().includes('telugu')) && isNotExplicitlyMale(v));
      if (teAny) return teAny;
    } else if (languageCode === 'HI') {
      const hiFemale = voices.find(v => (v.lang.includes('hi') || v.name.toLowerCase().includes('hindi')) && isFemale(v));
      if (hiFemale) return hiFemale;

      const hiAny = voices.find(v => (v.lang.includes('hi') || v.name.toLowerCase().includes('hindi')) && isNotExplicitlyMale(v));
      if (hiAny) return hiAny;
    } else {
      const enInFemale = voices.find(v => v.lang.toLowerCase().includes('en-in') && isFemale(v));
      if (enInFemale) return enInFemale;
    }

    // 2. High-quality Indian English Female Voice (e.g. Neerja, Heera, Veena)
    const indFemale = voices.find(v => 
      (v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india')) && isFemale(v)
    );
    if (indFemale) return indFemale;

    // 3. Clear English Natural Female Voice (e.g. Jenny, Aria, Samantha, Zira, Google UK English Female)
    const anyEnFemale = voices.find(v => v.lang.toLowerCase().startsWith('en') && isFemale(v));
    if (anyEnFemale) return anyEnFemale;

    // 4. Any female voice available in the browser
    const anyFemale = voices.find(v => isFemale(v));
    if (anyFemale) return anyFemale;

    // 5. Fallback to any non-male voice
    return voices.find(v => isNotExplicitlyMale(v)) || voices[0];
  }

  cleanTextForSpeech(rawText) {
    if (!rawText) return '';
    return rawText
      // Remove emojis
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '')
      // Remove markdown bold/italics/bullet markers
      .replace(/[*_~`#>-]/g, '')
      // Replace repeated newlines with single space
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  speak(text, languageCode = 'EN', onStart, onEnd, onError) {
    speakDoorlynResponse(text, languageCode, onStart, onEnd, onError);
  }

  getPhoneticTransliteration(text, languageCode) {
    if (languageCode === 'TE') {
      return text
        .replace(/డోర్‌లిన్/g, 'Doorlyn')
        .replace(/ఐవిఆర్ఎస్/g, 'I V R S')
        .replace(/సేవలకు స్వాగతం/g, 'sevalaku svaagatam')
        .replace(/ఎలక్ట్రీషియన్/g, 'Electrician')
        .replace(/ఇంటి రిపేర్ల/g, 'inti repairla')
        .replace(/కోసం/g, 'kosam')
        .replace(/నొక్కండి/g, 'nokkandi')
        .replace(/హెల్త్‌కేర్/g, 'Healthcare')
        .replace(/బ్లడ్ టెస్ట్/g, 'Blood Test')
        .replace(/ఎక్స్‌ప్రెస్/g, 'Express')
        .replace(/పార్శిల్/g, 'Parcel')
        .replace(/పికప్/g, 'Pickup')
        .replace(/నిమిషాల/g, 'nimishala')
        .replace(/గ్రోసరీ/g, 'Grocery')
        .replace(/బుకింగ్/g, 'Booking')
        .replace(/ట్రాకింగ్/g, 'Tracking')
        .replace(/లేదా/g, 'leda')
        .replace(/లైవ్ సపోర్ట్/g, 'Live Support')
        .replace(/మీరు తెలుగు భాషను ఎంచుకున్నారు/g, 'Meeru Telugu bhashanu enchukunnaaru')
        .replace(/సర్వీస్ వివరాలు/g, 'Service vivaralu')
        .replace(/మరియు/g, 'mariyu')
        .replace(/సేవలు/g, 'sevalu')
        .replace(/వెరిఫైడ్/g, 'Verified')
        .replace(/సాంకేతిక నిపుణుడు/g, 'saanketika nipunudu')
        .replace(/మీ ఇంటికి వస్తారు/g, 'mee intiki vastaru')
        .replace(/రోజుల గ్యారెంటీతో/g, 'rojula guarantee to')
        .replace(/ఫిక్స్డ్/g, 'Fixed')
        .replace(/విజిట్/g, 'visit')
        .replace(/ఛార్జ్/g, 'charge')
        .replace(/రూపాయలు/g, 'rupayalu')
        .replace(/ఖరారు చేయడానికి/g, 'khararu cheyadaniki')
        .replace(/మెయిన్ మెనూకి/g, 'main menu ki')
        .replace(/వెళ్ళడానికి/g, 'velladaniki')
        .replace(/ఫుల్ బాడీ/g, 'Full Body')
        .replace(/చెకప్/g, 'Checkup')
        .replace(/సర్టిఫైడ్/g, 'Certified')
        .replace(/ల్యాబ్/g, 'Lab')
        .replace(/నిపుణుడు/g, 'nipunudu')
        .replace(/రేపు ఉదయం/g, 'repu udayam')
        .replace(/గంటలకు/g, 'gantalaku')
        .replace(/మీ ఇంట/g, 'mee inta')
        .replace(/శామ్‌పిల్/g, 'sample')
        .replace(/కలెక్ట్ చేస్తారు/g, 'collect chestaru')
        .replace(/మొత్తం ధర/g, 'mottam dhara')
        .replace(/రిపోర్ట్‌తో/g, 'report to')
        .replace(/సహా/g, 'sahaa')
        .replace(/డెలివరీ/g, 'delivery')
        .replace(/చేయబడుతుంది/g, 'cheyabadutundi')
        .replace(/తాజా కూరగాయలు/g, 'taajaa kooragaayalu')
        .replace(/నిత్యావసరాల/g, 'nityaavasarala')
        .replace(/ప్యాక్/g, 'pack')
        .replace(/సక్రియ/g, 'sakriya')
        .replace(/ధృవీకరించబడింది/g, 'dhruveekarinchabadindi')
        .replace(/కనెక్ట్ చేయబడుతోంది/g, 'connect cheyabadutondi')
        .replace(/దయచేసి/g, 'dayachesi')
        .replace(/వేచి ఉండండి/g, 'vechi undandi')
        .replace(/అభినందనలు/g, 'Abhinandanalu')
        .replace(/విజయవంతంగా/g, 'vijayavantanga')
        .replace(/నమోదు/g, 'namodu')
        .replace(/సందేశం/g, 'sandesham')
        .replace(/పంపబడింది/g, 'pampabadindi')
        .replace(/ఇప్పటికే/g, 'ippatike')
        .replace(/నమోదైంది/g, 'namodaindi')
        .replace(/ప్రధాన/g, 'pradhana')
        .replace(/మెనూ/g, 'menu');
    }

    if (languageCode === 'HI') {
      return text
        .replace(/डोरलिन/g, 'Doorlyn')
        .replace(/आईवीआरएस/g, 'I V R S')
        .replace(/में आपका स्वागत है/g, 'mein aapka swagat hai')
        .replace(/इलेक्ट्रीशियन/g, 'Electrician')
        .replace(/रिपेयर/g, 'repair')
        .replace(/के लिए/g, 'ke liye')
        .replace(/दबाएं/g, 'dabaye')
        .replace(/सीबीसी/g, 'C B C')
        .replace(/ब्लड टेस्ट/g, 'Blood Test')
        .replace(/एक्सप्रेस/g, 'Express')
        .replace(/पार्सल/g, 'Parcel')
        .replace(/किराना/g, 'grocery')
        .replace(/डिलीवरी/g, 'delivery')
        .replace(/बुकिंग/g, 'booking')
        .replace(/स्थिति/g, 'status')
        .replace(/सहायता/g, 'sahayata')
        .replace(/सेवा विवरण/g, 'Seva vivaran')
        .replace(/सत्यापित/g, 'satyapit')
        .replace(/तकनीशियन/g, 'takneeshian')
        .replace(/मिनट/g, 'minute')
        .replace(/पहुंचेगा/g, 'pahunchega')
        .replace(/वारंटी/g, 'warranty')
        .replace(/साथ/g, 'saath')
        .replace(/शुल्क/g, 'shulak')
        .replace(/रुपये/g, 'rupaye')
        .replace(/पक्का करने/g, 'pakka karne')
        .replace(/वापस जाने/g, 'vapas jaane')
        .replace(/जांच/g, 'jaanch')
        .replace(/प्रमाणित/g, 'pramanit')
        .replace(/कल सुबह/g, 'kal subah')
        .replace(/सैंपल/g, 'sample')
        .replace(/लेगा/g, 'lega')
        .replace(/कुल मूल्य/g, 'kul moolya')
        .replace(/बधाई हो/g, 'Badhai ho')
        .replace(/सफलतापूर्वक/g, 'safaltapoorvak')
        .replace(/दर्ज/g, 'darj')
        .replace(/कर ली गई है/g, 'kar li gayi hai')
        .replace(/पुष्टि/g, 'pushti')
        .replace(/संदेश/g, 'sandesh')
        .replace(/भेज दिया गया है/g, 'bhej diya gaya hai');
    }

    // Strip any remaining non-Latin script characters to ensure English SpeechSynthesizer never freezes or mutes
    return text.replace(/[\u0C00-\u0C7F\u0900-\u097F]/g, ' ');
  }
}

export const detectLastServiceContext = (history = [], fallbackText = '') => {
  const reversedHistory = [...history].reverse();
  const searchItems = [fallbackText, ...reversedHistory.map(h => typeof h === 'string' ? h : (h.content || ''))];

  for (const item of searchItems) {
    const txt = (item || '').toLowerCase();
    
    if (txt.includes('electrician') || txt.includes('wiring') || txt.includes('short circuit') || txt.includes('fan') || txt.includes('carpenter') || txt.includes('switchboard') || txt.includes('इलेक्ट्रीशियन') || txt.includes('ఎలక్ట్రీషియన్') || txt.includes('ఫ్యాన్') || txt.includes('बिजली')) {
      return 'electrician';
    }
    if (txt.includes('plumber') || txt.includes('tap') || txt.includes('leak') || txt.includes('pipe') || txt.includes('sink') || txt.includes('drain') || txt.includes('నల్లా') || txt.includes('ప్లంబర్') || txt.includes('नल') || txt.includes('प्लंबर')) {
      return 'plumber';
    }
    if (txt.includes('tutor') || txt.includes('tuition') || txt.includes('teacher') || txt.includes('coaching') || txt.includes('student') || txt.includes('homework') || txt.includes('study') || txt.includes('ట్యూటర్') || txt.includes('ట్యూషన్') || txt.includes('ट्यूटर') || txt.includes('ट्यूशन')) {
      return 'tutor';
    }
    if (txt.includes('blood') || txt.includes('cbc') || txt.includes('sugar') || txt.includes('thyroid') || txt.includes('pcod') || txt.includes('diagnostic') || txt.includes('checkup') || txt.includes('doctor') || txt.includes('lab') || txt.includes('రక్త') || txt.includes('హెల్త్') || txt.includes('खून')) {
      return 'healthcare';
    }
    if (txt.includes('parcel') || txt.includes('pickup') || txt.includes('rapido') || txt.includes('drop') || txt.includes('courier') || txt.includes('पार्सल') || txt.includes('పార్శిల్')) {
      return 'parcel';
    }
    if (txt.includes('grocer') || txt.includes('grocery') || txt.includes('groceries') || txt.includes('supermarket') || txt.includes('kirana') || txt.includes('rice') || txt.includes('milk') || txt.includes('vegetable') || txt.includes('राशन') || txt.includes('గ్రోసరీ')) {
      return 'grocery';
    }
    if (txt.includes('shift') || txt.includes('truck') || txt.includes('moving') || txt.includes('relocation') || txt.includes('logistics') || txt.includes('शिफ्टिंग') || txt.includes('షిఫ్టింగ్')) {
      return 'shifting';
    }
    if (txt.includes('cater') || txt.includes('catering') || txt.includes('caterer') || txt.includes('buffet') || txt.includes('cook') || txt.includes('chef') || txt.includes('केटरिंग') || txt.includes('కేటరింగ్')) {
      return 'catering';
    }
    if (txt.includes('worker') || txt.includes('mason') || txt.includes('mestri') || txt.includes('labor') || txt.includes('मजदूर') || txt.includes('కూలీ') || txt.includes('మేస్త్రీ')) {
      return 'worker';
    }
  }

  return null;
};

export const processAIIntent = (userMessage, language = 'EN', history = []) => {
  const text = (userMessage || '').toLowerCase();

  // 1. Check EXPLICIT Service Intent from CURRENT user message (highest priority)
  const isTutorIntent = text.includes('tutor') || text.includes('tuition') || text.includes('teacher') || text.includes('coaching') || text.includes('exam') || text.includes('student') || text.includes('homework') || text.includes('study') || text.includes('ట్యూటర్') || text.includes('ట్యూషన్') || text.includes('టీచర్') || text.includes('కోచింగ్') || text.includes('చదువు') || text.includes('పరీక్ష') || text.includes('ट्यूटर') || text.includes('ट्यूशन') || text.includes('पढ़ाई') || text.includes('कोचिंग') || text.includes('टीचर');

  const isPlumberIntent = text.includes('plumber') || text.includes('tap') || text.includes('leak') || text.includes('pipe') || text.includes('sink') || text.includes('drain') || text.includes('నల్లా') || text.includes('ప్లంబర్') || text.includes('ప్లంబింగ్') || text.includes('नल') || text.includes('लीकेज') || text.includes('प्लंबर');

  const isElectricianIntent = text.includes('electrician') || text.includes('wiring') || text.includes('short circuit') || text.includes('fan') || text.includes('carpenter') || text.includes('ac') || text.includes('इलेक्ट्रीशियन') || text.includes('ఎలక్ట్రీషియన్') || text.includes('ఫ్యాన్') || text.includes('बिजली') || text.includes('फैन');

  const isHealthcareIntent = text.includes('blood') || text.includes('cbc') || text.includes('sugar') || text.includes('thyroid') || text.includes('pcod') || text.includes('pregnancy') || text.includes('health') || text.includes('diagnostic') || text.includes('checkup') || text.includes('doctor') || text.includes('lab') || text.includes('రక్త') || text.includes('హెల్త్') || text.includes('డయాగ్నోస్టిక్') || text.includes('చెకప్') || text.includes('खून') || text.includes('लैब') || text.includes('हेल्थ') || text.includes('डायग्नोस्टिक');

  const isParcelIntent = text.includes('parcel') || text.includes('pickup') || text.includes('rapido') || text.includes('drop') || text.includes('courier') || text.includes('पार्सल') || text.includes('पिकअप') || text.includes('ड्रॉप') || text.includes('పార్శిల్') || text.includes('పికప్') || text.includes('డ్రాప్');

  const isGroceryIntent = text.includes('grocer') || text.includes('grocery') || text.includes('groceries') || text.includes('supermarket') || text.includes('kirana') || text.includes('staple') || text.includes('rice') || text.includes('milk') || text.includes('vegetable') || text.includes('fruit') || text.includes('dal') || text.includes('oil') || text.includes('atta') || text.includes('राशन') || text.includes('दूध') || text.includes('सब्जी') || text.includes('फल') || text.includes('किराना') || text.includes('గ్రోసరీ') || text.includes('కూరగాయలు') || text.includes('పాలు') || text.includes('కిరాణా') || text.includes('బియ్యం') || text.includes('నిత్యావసరాలు');

  const isShiftingIntent = text.includes('shift') || text.includes('truck') || text.includes('moving') || text.includes('relocation') || text.includes('logistics') || text.includes('घर बदलना') || text.includes('शिफ्टिंग') || text.includes('लॉजिस्टिक्स') || text.includes('ట్రక్') || text.includes('షిఫ్టింగ్') || text.includes('లాజిస్టిక్స్') || text.includes('ఇల్లు షిఫ్టింగ్');

  const isCateringIntent = text.includes('cater') || text.includes('catering') || text.includes('caterer') || text.includes('buffet') || text.includes('cook') || text.includes('chef') || text.includes('केटरिंग') || text.includes('కేటరింగ్') || text.includes('వంట');

  const isWorkerIntent = text.includes('worker') || text.includes('clean') || text.includes('mason') || text.includes('mestri') || text.includes('labor') || text.includes('मजदूर') || text.includes('मिस्त्री') || text.includes('सफाई') || text.includes('वर्कर') || text.includes('వర్కర్') || text.includes('కూలీ') || text.includes('మేస్త్రీ') || text.includes('మిస్త్రీ') || text.includes('క్లీనింగ్');

  // 2. Follow-up affirmative responses ONLY when no explicit service intent is provided in current message
  const hasSpecificServiceIntent = isTutorIntent || isPlumberIntent || isElectricianIntent || isHealthcareIntent || isParcelIntent || isGroceryIntent || isShiftingIntent || isCateringIntent || isWorkerIntent;

  const lastContext = detectLastServiceContext(history, text);

  // Check for Gratitude / Thank You Messages ("thank you", "thanks", "धन्यवाद", "ధన్యవాదాలు")
  const isGratitudeIntent = !hasSpecificServiceIntent && (text.includes('thank') || text.includes('thanks') || text.includes('thx') || text.includes('dhanyawad') || text.includes('dhanyavad') || text.includes('धन्यवाद') || text.includes('शुक्रिया') || text.includes('ధన్యవాదాలు') || text.includes('థాంక్స్') || text.includes('ధన్యవాదములు'));

  if (isGratitudeIntent) {
    if (language === 'HI') {
      return {
        reply: '🎉 आपका बहुत-बहुत धन्यवाद! डोरलिन सेवा का उपयोग करने के लिए शुक्रिया। हमारे सत्यापित पार्टनर तय समय पर आपके स्थान पर पहुंचेंगे। क्या मैं आपकी किसी और सेवा में सहायता कर सकता हूँ?',
        options: ['दूसरी सेवा बुक करें', 'मुख्य मेनू']
      };
    } else if (language === 'TE') {
      return {
        reply: '🎉 మీకు చాలా ధన్యవాదాలు! డోర్‌లిన్ సర్వీస్ బుక్ చేసుకున్నందుకు ధన్యవాదాలు. మా వెరిఫైడ్ పార్ట్‌నర్ సమయానికి మీ వద్దకు రానున్నారు. మీకు ఇంకేదైనా సేవ సహాయం కావాలా?',
        options: ['మరో సేవ బుక్ చేయండి', 'ప్రధాన మెనూ']
      };
    } else {
      return {
        reply: '🎉 You\'re very welcome! Thank you for booking your service with Doorlyn. Our verified partner will arrive on schedule. Is there anything else I can help you with today?',
        options: ['Book Another Service', 'Main Menu']
      };
    }
  }

  // Detect explicit "show all services" / "what services" / "about services" requests (overrides context)
  const isServiceListQuery = text.includes('service') || text.includes('services') || text.includes('what service') || text.includes('all service') || text.includes('show service') || text.includes('list service') || text.includes('your service') || text.includes('which service') || text.includes('services you') || text.includes('what do you') || text.includes('what can you') || text.includes('menu') || text.includes('help me') || text.includes('about service') || text.includes('service list') || text.includes('services list') || text.includes('8 service') || text.includes('available service') || text.includes('what do you offer') || text.includes('what are your') || text.includes('facilities') || text.includes('categories') || text.includes('category') || text.includes('verticals') || text.includes('doorlyn') || text.includes('options') || text.includes('tell me about') || text.includes('कौन सी सेवा') || text.includes('सेवाएं') || text.includes('सेवा') || text.includes('सर्विस') || text.includes('सर्विसेज') || text.includes('सूची') || text.includes('क्या काम') || text.includes('ఏ సేవ') || text.includes('సేవలు') || text.includes('సేవ') || text.includes('సర్వీస్') || text.includes('సర్వీసులు') || text.includes('లిస్ట్') || text.includes('ఏమి చేస్తారు');

  // If user explicitly asks about services, show full 8-service menu immediately
  if (isServiceListQuery && !hasSpecificServiceIntent) {
    if (language === 'HI') {
      return {
        reply: 'जी बिल्कुल! डोरलिन पर हम ये 8 प्रमुख सेवाएं प्रदान करते हैं:\n\n1. 🏥 हेल्थकेयर & डायग्नोस्टिक्स — CBC, ब्लड शुगर, फुल बॉडी चेकअप (₹349 से)\n2. 🔧 होम रिपेयर & किचन — इलेक्ट्रीशियन (₹249), प्लंबर (₹199), कारपेंटर\n3. 📦 पिकअप & ड्रॉप सेवा — पार्सल, गिफ्ट, लगेज डिलीवरी (₹69 से)\n4. 🚚 लॉजिस्टिक्स & शिफ्टिंग — घर, ऑफिस शिफ्टिंग, मिनी ट्रक (₹2499 से)\n5. 🛒 किराना & राशन — ताजी सब्जियां, दूध, दैनिक सामग्री (15 मिनट डिलीवरी)\n6. 👷 वर्कर मार्केटप्लेस — दिहाड़ी मजदूर (₹600/दिन), मिस्त्री, घर की सफाई\n7. 📚 स्टूडेंट ट्यूटर्स & सेवाएं — 1st-10th & इंटरमीडिएट ट्यूशन (₹299/घंटा से)\n8. 🍲 कैटरिंग & इवेंट सपोर्ट — शादी व पार्टी बुफे (₹299/प्लेट से)\n\nआप किस सेवा के बारे में जानना या बुक करना चाहते हैं?',
        options: ['🏥 हेल्थकेयर', '🔧 होम रिपेयर', '📦 पिकअप & ड्रॉप', '🚚 शिफ्टिंग', '🛒 किराना', '👷 वर्कर्स', '📚 ट्यूटर्स', '🍲 कैटरिंग']
      };
    } else if (language === 'TE') {
      return {
        reply: 'తప్పకుండా! డోర్‌లిన్ లో మేము ఈ 8 ప్రధాన సేవలను అందిస్తున్నాము:\n\n1. 🏥 హెల్త్‌కేర్ & డయాగ్నోస్టిక్స్ — CBC, బ్లడ్ షుగర్, ఫుల్ బాడీ చెకప్ (₹349 నుండి)\n2. 🔧 ఇంటి రిపేర్లు — ఎలక్ట్రీషియన్ (₹249), ప్లంబర్ (₹199), కార్పెంటర్\n3. 📦 పికప్ & డ్రాప్ సేవలు — పార్శిల్, గిఫ్ట్, లగేజ్ డెలివరీ (₹69 నుండి)\n4. 🚚 లాజిస్టిక్స్ & షిఫ్టింగ్ — ఇల్లు, ఆఫీస్ షిఫ్టింగ్, మినీ ట్రక్ (₹2499 నుండి)\n5. 🛒 గ్రోసరీ & నిత్యావసరాలు — కూరగాయలు, పాలు, నిత్యావసరాలు (15 నిమిషాల డెలివరీ)\n6. 👷 వర్కర్ మార్కెట్‌ప్లేస్ — కూలీలు (₹600/రోజు), మేస్త్రీ, డీప్ క్లీనింగ్\n7. 📚 స్టూడెంట్ ట్యూటర్స్ — 1st-10th & ఇంటర్మీడియట్ హోమ్ & ఆన్‌లైన్ ట్యూషన్ (₹299/గంట నుండి)\n8. 🍲 కేటరింగ్ & ఈవెంట్ సేవలు — వివాహాలు & వేడుకల భోజనం (₹299/ప్లేట్ నుండి)\n\nమీకు ఏ సేవ అవసరమో సెలెక్ట్ చేయండి లేదా మాట్లాడండి!',
        options: ['🏥 హెల్త్‌కేర్', '🔧 ఇంటి రిపేర్లు', '📦 పికప్ & డ్రాప్', '🚚 షిఫ్టింగ్', '🛒 గ్రోసరీ', '👷 వర్కర్లు', '📚 ట్యూటర్స్', '🍲 కేటరింగ్']
      };
    } else {
      return {
        reply: 'Doorlyn provides 8 unified household services at your doorstep:\n\n1. 🏥 Healthcare & Diagnostics — CBC, Sugar, Thyroid, Full Body Checkup (from ₹349)\n2. 🔧 Home Repairs & Kitchen — Electricians (₹249), Plumbers (₹199), Carpenters & Appliances\n3. 📦 Pickup & Drop Service — Express Documents, Parcels, Gifts & Luggage (from ₹69)\n4. 🚚 Logistics & Shifting — 1BHK/2BHK House Relocation, Office Moving, Mini Trucks (from ₹2499)\n5. 🛒 Groceries & Essentials — Farm Fresh Veggies, Milk, Staples (15-min Express Delivery)\n6. 👷 Worker Marketplace — Verified Daily Wage Labor (₹600/day), Masons, Deep Cleaning\n7. 📚 Student Tutors & Services — 1st-10th & Intermediate Home/Online Tutors (from ₹299/hr)\n8. 🍲 Catering & Event Support — Wedding, Birthday & Event Buffets (from ₹299/plate)\n\nWhich service would you like to explore or book?',
        options: ['🏥 Healthcare', '🔧 Home Repairs', '📦 Pickup & Drop', '🚚 Shifting', '🛒 Groceries', '👷 Workers', '📚 Tutors', '🍲 Catering']
      };
    }
  }

  const isAffirmative = !hasSpecificServiceIntent && (text.includes('yes') || text.includes('confirm') || text.includes('sure') || text.includes('ok') || text.includes('हां') || text.includes('అవును') || text.includes('book') || text.includes('బుక్'));

  if (isAffirmative && lastContext) {
    if (lastContext === 'electrician') {
      return {
        reply: language === 'HI'
          ? 'इलेक्ट्रीशियन सर्विस कन्फर्म हो गई है! सत्यापित तकनीशियन जल्द से जल्द पहुंचेगा।'
          : language === 'TE'
          ? 'ఎలక్ట్రీషియన్ బుకింగ్ కన్ఫర్మ్ అయింది! వెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు.'
          : 'Electrician booking confirmed! Verified technicians arrive as soon as possible for fan repair & wiring.',
        options: ['Track Technician Status'],
        action: { type: 'BOOK_SERVICE', serviceId: 'electrician-services', serviceName: 'Electrician - Fan Repair & Wiring', price: 249, serviceCategory: 'Home Repairs' }
      };
    } else if (lastContext === 'plumber') {
      return {
        reply: language === 'HI'
          ? 'प्लंबर सर्विस कन्फर्म हो गई है! सत्यापित तकनीशियन जल्द से जल्द पहुंचेगा।'
          : language === 'TE'
          ? 'ప్లంబర్ బుకింగ్ కన్ఫర్మ్ అయింది! వెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు.'
          : 'Plumber booking confirmed! Verified technicians arrive as soon as possible for pipe and tap repair.',
        options: ['Track Technician Status'],
        action: { type: 'BOOK_SERVICE', serviceId: 'plumber-services', serviceName: 'Plumber - Pipe & Tap Repair', price: 199, serviceCategory: 'Home Repairs' }
      };
    } else if (lastContext === 'tutor') {
      return {
        reply: language === 'HI'
          ? 'होम ट्यूटर सेवा कन्फर्म हो गई है! हमारे शिक्षा विशेषज्ञ आपसे संपर्क करेंगे।'
          : language === 'TE'
          ? 'హోమ్ ట్యూటర్ బుకింగ్ కన్ఫర్మ్ అయింది! మా ఎడ్యుకేషన్ అడ్వైజర్ మిమ్మల్ని సంప్రదిస్తారు.'
          : 'Home Tutor booking confirmed! Verified tutor arriving for student coaching.',
        options: ['View Booking Status'],
        action: { type: 'BOOK_SERVICE', serviceId: 'home-tutor', serviceName: 'Home & Online Tutor Service', price: 299, serviceCategory: 'Student Tutors & Services' }
      };
    } else if (lastContext === 'healthcare') {
      return {
        reply: language === 'HI' 
          ? 'उत्कृष्ट! आपका CBC और ब्लड शुगर होम कलेक्शन कल सुबह 8 बजे के लिए बुक कर दिया गया है।'
          : language === 'TE'
          ? 'చాలా మంచిది! రేపు ఉదయం 8 గంటలకు CBC టెస్ట్ హోమ్ కలెక్షన్ బుక్ చేయబడింది.'
          : 'Great! I have confirmed your CBC & Blood Sugar diagnostic home collection. Our phlebotomist will arrive at your address.',
        options: ['View Booking Status'],
        action: { type: 'BOOK_SERVICE', serviceId: 'cbc-test', serviceName: 'CBC Test (Complete Blood Count)', price: 349, serviceCategory: 'Healthcare & Diagnostic' }
      };
    } else if (lastContext === 'parcel') {
      return {
        reply: language === 'HI'
          ? 'पार्सल पिकअप बुक हो गया है! रैपिडो राइडर 15 मिनट में पहुंचेगा।'
          : language === 'TE'
          ? 'పార్శిల్ పికప్ బుక్ అయింది! 15 నిమిషాల్లో డెలివరీ పార్ట్‌నర్ రానున్నారు.'
          : 'Express Parcel Pickup Confirmed! A Doorlyn partner has been assigned for 15-minute pickup.',
        options: ['Track Courier Rider'],
        action: { type: 'BOOK_SERVICE', serviceId: 'small-parcel', serviceName: 'Small Parcel Pickup & Drop', price: 69, serviceCategory: 'Pickup & Drop' }
      };
    } else if (lastContext === 'shifting') {
      return {
        reply: language === 'HI'
          ? 'हाउस शिफ्टिंग सर्विस कन्फर्म हो गई है!'
          : language === 'TE'
          ? 'హౌస్ షిఫ్టింగ్ సర్వీస్ బుక్ అయింది!'
          : 'House Shifting Booking Confirmed! Our logistics team will call you for address confirmation.',
        options: ['Track Logistics Team'],
        action: { type: 'BOOK_SERVICE', serviceId: 'house-shifting', serviceName: 'Local House Shifting', price: 2499, serviceCategory: 'Logistics & Shifting' }
      };
    } else if (lastContext === 'catering') {
      return {
        reply: language === 'HI'
          ? 'केटरिंग सेवा कन्फर्म हो गई है!'
          : language === 'TE'
          ? 'కేటరింగ్ బుకింగ్ కన్ఫర్మ్ అయింది!'
          : 'Event Catering Booking Confirmed! Our event manager will contact you for menu selection.',
        options: ['View Catering Booking'],
        action: { type: 'BOOK_SERVICE', serviceId: 'catering-service', serviceName: 'Event & Bulk Catering Service', price: 299, serviceCategory: 'Food & Catering Services' }
      };
    } else if (lastContext === 'worker') {
      return {
        reply: language === 'HI'
          ? 'वर्कर मार्केटप्लेस बुकिंग कन्फर्म हो गई है!'
          : language === 'TE'
          ? 'వర్కర్ మార్కెట్‌ప్లేస్ బుకింగ్ కన్ఫర్మ్ అయింది!'
          : 'Worker Marketplace Booking Confirmed! Verified worker assigned.',
        options: ['Track Worker Status'],
        action: { type: 'BOOK_SERVICE', serviceId: 'daily-wage-worker', serviceName: 'Daily Wage Workers', price: 600, serviceCategory: 'Worker Marketplace' }
      };
    }
  }

  // Intent 0: Student Tutors & Education Services
  if (isTutorIntent) {
    if (language === 'HI') {
      return {
        reply: '📚 डोरलिन स्टूडेंट ट्यूटर्स & शिक्षा उप-सेवा विवरण:\n• प्राइमरी होम ट्यूटर (कक्षा 1 से 5): ₹1800/माह (या ₹299/घंटा)\n• हाई स्कूल ट्यूटर (कक्षा 6 से 10 - गणित व विज्ञान): ₹2500/माह\n• इंटरमीडिएट MPC / BiPC कोचिंग (IIT-JEE/NEET): ₹3500/माह\n• ऑनलाइन 1-on-1 लाइव ट्यूशन: ₹1500/माह\n• ईपास & सरकारी छात्रवृत्ति (Scholarship) फॉर्म सहायता: ₹299\n• कॉलेज प्रवेश व करियर काउंसलिंग: ₹499\n\nसभी ट्यूटर डिग्रीड व सत्यापित हैं!',
        options: ['होम ट्यूटर बुक करें (₹2500)', 'छात्रवृत्ति फॉर्म (₹299)', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'home-tutor', serviceName: 'Home & Online Tutor Service', price: 299, serviceCategory: 'Student Tutors & Services' }
      };
    } else if (language === 'TE') {
      return {
        reply: '📚 డోర్‌లిన్ స్టూడెంట్ ట్యూటర్స్ & ఎడ్యుకేషన్ సబ్-సర్వీసెస్ వివరాలు:\n• ప్రైమరీ హోమ్ ట్యూటర్ (1 నుండి 5వ తరగతి): ₹1800/నెల (లేదా ₹299/గంట)\n• హైస్కూల్ ట్యూటర్ (6 నుండి 10వ తరగతి - మ్యాథ్స్ & సైన్స్): ₹2500/నెల\n• ఇంటర్మీడియట్ MPC / BiPC కోచింగ్ (EAMCET/JEE/NEET): ₹3500/నెల\n• ఆన్‌లైన్ 1-on-1 లైవ్ ట్యూషన్: ₹1500/నెల\n• Epass & ప్రభుత్వ స్కాలర్‌షిప్ అప్లికేషన్ సహాయం: ₹299\n• కాలేజ్ అడ్మిషన్ & కెరీర్ కౌన్సెలింగ్: ₹499\n\nఅందరూ సర్టిఫైడ్ టీచర్లు!',
        options: ['హోమ్ ట్యూటర్ బుక్ చేయండి (₹2500)', 'స్కాలర్‌షిప్ సహాయం (₹299)', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'home-tutor', serviceName: 'Home & Online Tutor Service', price: 299, serviceCategory: 'Student Tutors & Services' }
      };
    } else {
      return {
        reply: '📚 Doorlyn Student Tutors & Education Sub-Services List:\n• Primary Home Tutor (Class 1-5 All Subjects): ₹1800/mo (or ₹299/hr)\n• High School Tutor (Class 6-10 Maths & Science): ₹2500/mo\n• Intermediate MPC/BiPC Entrance Specialist: ₹3500/mo\n• Online 1-on-1 Personalized Live Tuition: ₹1500/mo\n• Epass & Govt Scholarship Application Assistance: ₹299\n• College Entrance & Career Counseling Session: ₹499\n\nAll tutors are background verified degree holders!',
        options: ['Book Home Tutor (₹2500)', 'Scholarship Help (₹299)', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'home-tutor', serviceName: 'Home & Online Tutor Service', price: 299, serviceCategory: 'Student Tutors & Services' }
      };
    }
  }

  // Intent 1: Plumber & Water Leak Repairs
  if (isPlumberIntent) {
    if (language === 'HI') {
      return {
        reply: '🔧 डोरलिन प्लंबिंग सेवा & उप-सेवा विवरण:\n• नल व फॉसेट रिपेयर: ₹149\n• सिंक व ड्रेन ब्लॉकेज हटाना: ₹199\n• वाल मिक्सर व शॉवर फिटिंग: ₹299\n• पाइप लीकेज सीलिंग व जॉइंट्स: ₹349\n• पानी की टंकी सफाई व वाल्व रिपेयर: ₹499\n\nसत्यापित तकनीशियन जल्द से जल्द पहुंचेगा। क्या आप प्लंबर बुक करना चाहते हैं?',
        options: ['प्लंबर बुक करें', '📍 प्राथमिक पता', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'plumber-services', serviceName: 'Plumber - Pipe & Tap Repair', price: 199, serviceCategory: 'Home Repairs' }
      };
    } else if (language === 'TE') {
      return {
        reply: '🔧 డోర్‌లిన్ ప్లంబింగ్ సేవలు & సబ్-సర్వీసెస్ వివరాలు:\n• నల్లా / ట్యాప్ రిపేర్: ₹149\n• సింక్ & డ్రెయిన్ అన్‌బ్లాకింగ్: ₹199\n• వాల్ మిక్సర్ & షవర్ ఫిట్టింగ్: ₹299\n• పైప్ లీకేజ్ సీలింగ్ & జాయింట్లు: ₹349\n• వాటర్ ట్యాంక్ క్లీనింగ్ & వాల్వ్ ఫిక్స్: ₹499\n\nవెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు. ఇప్పుడు బుక్ చేయమంటారా?',
        options: ['ప్లంబర్ బుక్ చేయండి', '📍 ప్రాథమిక అడ్రస్', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'plumber-services', serviceName: 'Plumber - Pipe & Tap Repair', price: 199, serviceCategory: 'Home Repairs' }
      };
    } else {
      return {
        reply: '🔧 Doorlyn Plumbing Services & Sub-Services List:\n• Tap & Faucet Repair/Washer Change: ₹149\n• Sink & Washbasin Drain Blockage Removal: ₹199\n• Wall Mixer & Shower Head Installation: ₹299\n• CPVC/UPVC Pipe Leak Sealing & Joints: ₹349\n• Water Tank Overflow & Valve Repair: ₹499\n\nVerified technicians arrive as soon as possible! Would you like to book a plumber now?',
        options: ['Book Plumber Now', '📍 Use Primary Address', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'plumber-services', serviceName: 'Plumber - Pipe & Tap Repair', price: 199, serviceCategory: 'Home Repairs' }
      };
    }
  }

  // Intent 2: Electrician & Appliance Repair
  if (isElectricianIntent) {
    if (language === 'HI') {
      return {
        reply: '⚡ डोरलिन इलेक्ट्रीशियन सेवा & उप-सेवा विवरण:\n• पंखा रिपेयर व कैपेसिटर: ₹199\n• स्विचबोर्ड व 16A सॉकेट फिटिंग: ₹149\n• एमसीबी फ्यूज व शॉर्ट सर्किट फिक्स: ₹249\n• इन्वर्टर व बैटरी बैकअप वायरिंग: ₹399\n• एलईडी लाइट व झूमर फिटिंग: ₹129\n\nसत्यापित तकनीशियन जल्द से जल्द पहुंचेगा।',
        options: ['इलेक्ट्रीशियन बुक करें', '📍 प्राथमिक पता', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'electrician-services', serviceName: 'Electrician - Fan Repair & Wiring', price: 249, serviceCategory: 'Home Repairs' }
      };
    } else if (language === 'TE') {
      return {
        reply: '⚡ డోర్‌లిన్ ఎలక్ట్రీషియన్ సేవలు & సబ్-సర్వీసెస్ వివరాలు:\n• సీలింగ్ ఫ్యాన్ రిపేర్ & కెపాసిటర్: ₹199\n• స్విచ్ బోర్డ్ & 16A సాకెట్ ఫిట్టింగ్: ₹149\n• MCB ఫ్యూజ్ & షార్ట్ సర్క్యూట్ ఫిక్స్: ₹249\n• ఇన్వర్టర్ & బ్యాటరీ వైరింగ్ సెటప్: ₹399\n• LED లైట్ & ఫ్యాన్సీ లైటింగ్: ₹129\n\nవెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు.',
        options: ['ఎలక్ట్రీషియన్ బుక్ చేయండి', '📍 ప్రాథమిక అడ్రస్', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'electrician-services', serviceName: 'Electrician - Fan Repair & Wiring', price: 249, serviceCategory: 'Home Repairs' }
      };
    } else {
      return {
        reply: '⚡ Doorlyn Electrician Services & Sub-Services List:\n• Ceiling Fan Repair & Capacitor Change: ₹199\n• Switchboard Repair & 16A Heavy Socket: ₹149\n• MCB Fuse Replacement & Short Circuit Fix: ₹249\n• Inverter & Battery Backup Dual Wiring: ₹399\n• LED Batten & Decorative Light Fitting: ₹129\n\nVerified technicians arrive as soon as possible. Would you like to book an electrician?',
        options: ['Book Electrician Now', '📍 Use Primary Address', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'electrician-services', serviceName: 'Electrician - Fan Repair & Wiring', price: 249, serviceCategory: 'Home Repairs' }
      };
    }
  }

  // Intent 3: Healthcare / Blood test / CBC / Sugar
  if (isHealthcareIntent) {
    if (language === 'HI') {
      return {
        reply: '🏥 डोरलिन हेल्थकेयर & डायग्नोस्टिक्स उप-सेवा सूची:\n• सीबीसी (Complete Blood Count): ₹349\n• फास्टिंग / पोस्ट प्रांडियल शुगर: ₹149 (Dual Sugar: ₹249)\n• HbA1c 3-महीने शुगर मार्कर: ₹349\n• मास्टर फुल बॉडी चेकअप (68 टेस्ट): ₹999\n• थायराइड प्रोफाइल (T3, T4, TSH): ₹449\n• महिला PCOD/PCOS हार्मोन जांच: ₹1299\n• प्रेगनेंसी एंटीनेटल जांच: ₹1499\n\nघर बैठे मुफ्त स्टेराइल सैंपल कलेक्शन और 24 घंटे में डिजिटल रिपोर्ट!',
        options: ['CBC टेस्ट बुक करें', 'फुल बॉडी चेकअप (₹999)', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'cbc-test', serviceName: 'CBC Test (Complete Blood Count)', price: 349, serviceCategory: 'Healthcare & Diagnostic' }
      };
    } else if (language === 'TE') {
      return {
        reply: '🏥 డోర్‌లిన్ హెల్త్‌కేర్ & డయాగ్నోస్టిక్స్ సబ్-సర్వీసెస్ వివరాలు:\n• సీబీసీ (Complete Blood Count): ₹349\n• ఫాస్టింగ్ / భోజనం తర్వాత షుగర్: ₹149 (Dual Sugar: ₹249)\n• HbA1c 3-నెలల షుగర్ మార్కర్: ₹349\n• మాస్టర్ ఫుల్ బాడీ చెకప్ (68 పారామీటర్లు): ₹999\n• థైరాయిడ్ ప్రొఫైల్ (T3, T4, TSH): ₹449\n• పీసీఓడీ/పీసీఓఎస్ హార్మోన్ స్క్రీనింగ్: ₹1299\n• గర్భధారణ (ప్రెగ్నెన్సీ) యాంటీనేటల్ ప్యానెల్: ₹1499\n\nఇంటి వద్దకే ఉచిత శాంపిల్ సేకరణ మరియు 24 గంటల్లో డిజిటల్ రిపోర్ట్!',
        options: ['CBC టెస్ట్ బుక్ చేయండి', 'ఫుల్ బాడీ చెకప్ (₹999)', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'cbc-test', serviceName: 'CBC Test (Complete Blood Count)', price: 349, serviceCategory: 'Healthcare & Diagnostic' }
      };
    } else {
      return {
        reply: '🏥 Doorlyn Healthcare & Diagnostics Sub-Services List:\n• CBC Test (Complete Blood Count): ₹349\n• Fasting / PPBS Blood Sugar: ₹149 (Dual Sugar: ₹249, HbA1c: ₹349)\n• Master Full Body Checkup (68 Parameters): ₹999\n• Thyroid Profile (T3, T4, TSH): ₹449\n• PCOS / PCOD Hormone Panel: ₹1299\n• Antenatal Pregnancy Blood Panel: ₹1499\n\nIncludes free sterile home sample pickup & 24-hr digital report!',
        options: ['Book CBC Test Now', 'Book Full Body Checkup (₹999)', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'cbc-test', serviceName: 'CBC Test (Complete Blood Count)', price: 349, serviceCategory: 'Healthcare & Diagnostic' }
      };
    }
  }

  // Intent 4: Pickup & Drop / Parcel / Rapido
  if (isParcelIntent) {
    if (language === 'HI') {
      return {
        reply: '📦 डोरलिन पिकअप & ड्रॉप उप-सेवा सूची:\n• दस्तावेज व चाबी ट्रांसफर: ₹69 (5kg तक)\n• घर का खाना व टिफिन बॉक्स: ₹79\n• मोबाइल, लैपटॉप व इलेक्ट्रॉनिक्स: ₹99\n• 2-घंटे गारंटीकृत एक्सप्रेस डिलीवरी: ₹129\n• केक, फूल व गिफ्ट सरप्राइज डिलीवरी: ₹99\n• रेलवे स्टेशन व बस स्टैंड भारी सामान ड्रॉप: ₹199\n\n15 मिनट में डिलीवरी राइडर पहुंचेगा (लाइव जीपीएस ट्रैकिंग)।',
        options: ['छोटा पार्सल बुक करें (₹69)', '2-घंटे एक्सप्रेस', '📝 Open Full Booking Form'],
        action: { type: 'BOOK_SERVICE', serviceId: 'small-parcel', serviceName: 'Small Parcel Pickup & Drop', price: 69, serviceCategory: 'Pickup & Drop' }
      };
    } else if (language === 'TE') {
      return {
        reply: '📦 డోర్‌లిన్ పికప్ & డ్రాప్ సబ్-సర్వీసెస్ వివరాలు:\n• డాక్యుమెంట్లు & కీలు బదిలీ: ₹69 (5kg వరకు)\n• ఇంటి వంట & టిఫిన్ బాక్స్ డెలివరీ: ₹79\n• మొబైల్, ల్యాప్‌టాప్ & ఎలక్ట్రానిక్స్: ₹99\n• 2-గంటల గ్యారెంటీడ్ ఎక్స్‌ప్రెస్ డెలివరీ: ₹129\n• కేక్, పువ్వులు & గిఫ్ట్ సర్ప్రైజ్ డెలివరీ: ₹99\n• రైల్వే స్టేషన్ & బస్ స్టాండ్ లగేజ్ డ్రాప్: ₹199\n\n15 నిమిషాల్లో డెలివరీ రైడర్ వస్తారు (లైవ్ GPS ట్రాకింగ్).',
        options: ['స్మాల్ పార్శిల్ బుక్ చేయండి (₹69)', '2-గంటల ఎక్స్‌ప్రెస్', '📝 Open Full Booking Form'],
        action: { type: 'BOOK_SERVICE', serviceId: 'small-parcel', serviceName: 'Small Parcel Pickup & Drop', price: 69, serviceCategory: 'Pickup & Drop' }
      };
    } else {
      return {
        reply: '📦 Doorlyn Express Parcel Sub-Services List:\n• Urgent Documents & Keys Transfer: ₹69 (Up to 5kg)\n• Home Cooked Food & Tiffin Box Delivery: ₹79\n• Mobile, Laptop & Electronics Transfer: ₹99\n• Guaranteed 2-Hour Express Delivery: ₹129\n• Cake, Flowers & Gift Surprise Drop: ₹99\n• Railway Station & Bus Stand Heavy Luggage Drop: ₹199\n\nRider dispatched in 15 mins with live GPS tracking!',
        options: ['Book Small Parcel (₹69)', '2-Hour Express Delivery', '📝 Open Full Booking Form'],
        action: { type: 'BOOK_SERVICE', serviceId: 'small-parcel', serviceName: 'Small Parcel Pickup & Drop', price: 69, serviceCategory: 'Pickup & Drop' }
      };
    }
  }

  // Intent 5: Grocery & Daily Essentials
  if (isGroceryIntent) {
    if (language === 'HI') {
      return {
        reply: '🛒 डोरलिन 15-मिनट एक्सप्रेस ग्रोसरी उप-सेवा सूची:\n• ताजी सब्जियां बास्केट (टमाटर, प्याज, आलू 1kg प्रत्येक): ₹199\n• ताजे फल बास्केट (सेब, केला, अनार): ₹299\n• किचन राशन पैक (5kg चावल + 1kg दाल + 1L तेल): ₹899\n• ताजा दूध व दही पैक (2L दूध + 1kg दही): ₹149\n• 100% शुद्ध गाय का घी (500ml जार): ₹349\n• ड्राई फ्रूट्स पावर पैक (बादाम + काजू 250g): ₹499\n\n₹149 से ऊपर के ऑर्डर पर 15 मिनट में मुफ्त होम डिलीवरी!',
        options: ['ग्रोसरी स्टोर देखें', 'सब्जी व फल बास्केट', 'किचन राशन पैक (₹899)'],
        action: { type: 'VIEW_GROCERY', serviceCategory: 'Grocery & Daily Essentials', serviceName: 'Doorlyn 15-Min Express Grocery' }
      };
    } else if (language === 'TE') {
      return {
        reply: '🛒 డోర్‌లిన్ 15-నిమిషాల ఎక్స్‌ప్రెస్ గ్రోసరీ సబ్-సర్వీసెస్ వివరాలు:\n• తాజా కూరగాయల బాస్కెట్ (టమోటాలు, ఉల్లిపాయలు, బంగాళాదుంపలు 1kg చొప్పున): ₹199\n• తాజా పండ్ల బాస్కెట్ (యాపిల్స్, అరటి, దానిమ్మ): ₹299\n• నిత్యావసరాల ప్యాక్ (5kg బియ్యం + 1kg పప్పు + 1L నూనె): ₹899\n• తాజా పాలు & పెరుగు ప్యాక్ (2L పాలు + 1kg పెరుగు): ₹149\n• 100% స్వచ్ఛమైన ఆవు నెయ్యి (500ml జార్): ₹349\n• డ్రై ఫ్రూట్స్ ప్యాక్ (బాదం + జీడిపప్పు 250g): ₹499\n\n₹149 పైన ఆర్డర్లకు 15 నిమిషాల్లో ఉచిత డెలివరీ!',
        options: ['గ్రోసరీ స్టోర్ చూడండి', 'కూరగాయలు & పండ్ల బాస్కెట్', 'కిచెన్ రేషన్ ప్యాక్ (₹899)'],
        action: { type: 'VIEW_GROCERY', serviceCategory: 'Grocery & Daily Essentials', serviceName: 'Doorlyn 15-Min Express Grocery' }
      };
    } else {
      return {
        reply: '🛒 Doorlyn 15-Minute Express Grocery Sub-Services List:\n• Daily Essential Veggie Basket (Tomatoes, Onions, Potatoes 1kg each): ₹199\n• Exotic Fresh Fruit Basket (Apples, Bananas, Pomegranate): ₹299\n• Monthly Kitchen Staples Pack (5kg Rice + 1kg Dal + 1L Oil): ₹899\n• Fresh Milk & Thick Curd Pack (2L Milk + 1kg Curd): ₹149\n• Pure Cow Ghee (500ml Jar): ₹349\n• Dry Fruit Power Pack (Almonds & Cashews 250g each): ₹499\n\nFree 15-minute express delivery on orders above ₹149!',
        options: ['Explore Grocery Store', 'View Veggie & Fruit Basket', 'Add Monthly Staples Pack (₹899)'],
        action: { type: 'VIEW_GROCERY', serviceCategory: 'Grocery & Daily Essentials', serviceName: 'Doorlyn 15-Min Express Grocery' }
      };
    }
  }

  // Intent 6: House Shifting / Logistics
  if (isShiftingIntent) {
    if (language === 'HI') {
      return {
        reply: '🚚 डोरलिन लॉजिस्टिक्स & हाउस शिफ्टिंग उप-सेवा सूची:\n• 1BHK घर शिफ्टिंग (टाटा ऐस + 2 हेल्पर): ₹1999\n• 2BHK घर शिफ्टिंग (बोलेरो पिकअप + 3 हेल्पर): ₹2999\n• 3BHK विला / इंडिपेंडेंट हाउस शिफ्टिंग: ₹4499\n• सिंगल भारी सामान (सोफा/बेड/फ्रीज) ट्रांसपोर्ट: ₹899\n• छोटा ऑफिस शिफ्टिंग (10 वर्कस्टेशन तक): ₹4999\n• टाटा ऐस (छोटा हाथी) मिनी ट्रक किराया: ₹799 (पहले 5km)\n• बोलेरो ओपन पिकअप किराया: ₹999 (पहले 5km)\n\nमल्टी-लेयर बबल पैकिंग और अनुभवी लोडिंग हेल्पर शामिल!',
        options: ['1BHK शिफ्टिंग बुक करें (₹1999)', '2BHK शिफ्टिंग (₹2999)', '📝 Open Full Booking Form'],
        action: { type: 'BOOK_SERVICE', serviceId: 'house-shifting', serviceName: 'Local House Shifting', price: 2499, serviceCategory: 'Logistics & Shifting' }
      };
    } else if (language === 'TE') {
      return {
        reply: '🚚 డోర్‌లిన్ లాజిస్టిక్స్ & హౌస్ షిఫ్టింగ్ సబ్-సర్వీసెస్ వివరాలు:\n• 1BHK ఇల్లు షిఫ్టింగ్ (టాటా ఏస్ + 2 హెల్పర్లు): ₹1999\n• 2BHK ఇల్లు షిఫ్టింగ్ (బొలెరో पिकఅప్ + 3 హెల్పర్లు): ₹2999\n• 3BHK విల్లా / స్వతంత్ర ఇల్లు షిఫ్టింగ్: ₹4499\n• సింగిల్ పెద్ద వస్తువు (సోఫా/బెడ్/ఫ్రిజ్) రవాణా: ₹899\n• చిన్న ఆఫీస్ షిఫ్టింగ్ (10 వర్క్‌స్టేషన్ల వరకు): ₹4999\n• టాటా ఏస్ మినీ ట్రక్ అద్దె: ₹799 (మొదటి 5km)\n• బొలెరో ఓపెన్ పికప్ అద్దె: ₹999 (మొదటి 5km)\n\nబబుల్ ర్యాప్ ప్యాకింగ్ మరియు లోడింగ్ హెల్పర్లు ఉచితంగా లభిస్తారు!',
        options: ['1BHK షిఫ్టింగ్ బుక్ చేయండి (₹1999)', '2BHK షిఫ్టింగ్ (₹2999)', '📝 Open Full Booking Form'],
        action: { type: 'BOOK_SERVICE', serviceId: 'house-shifting', serviceName: 'Local House Shifting', price: 2499, serviceCategory: 'Logistics & Shifting' }
      };
    } else {
      return {
        reply: '🚚 Doorlyn Logistics & House Shifting Sub-Services List:\n• 1BHK Relocation (Tata Ace + 2 Helpers): ₹1999\n• 2BHK Relocation (Bolero Pickup + 3 Helpers): ₹2999\n• 3BHK Villa / Independent House Move: ₹4499\n• Single Heavy Item (Sofa / Bed / Fridge) Move: ₹899\n• Small Office Relocation (Up to 10 Workstations): ₹4999\n• Tata Ace (Chota Hathi) Hire: ₹799 (First 5 km)\n• Mahindra Bolero Open Pickup Hire: ₹999 (First 5 km)\n\nIncludes multi-layer bubble wrap packing & trained movers!',
        options: ['Book 1BHK Move (₹1999)', 'Book 2BHK Move (₹2999)', '📝 Open Full Booking Form'],
        action: { type: 'BOOK_SERVICE', serviceId: 'house-shifting', serviceName: 'Local House Shifting', price: 2499, serviceCategory: 'Logistics & Shifting' }
      };
    }
  }

  // Intent 7: Food & Catering Services
  if (isCateringIntent) {
    if (language === 'HI') {
      return {
        reply: '🍲 डोरलिन केटरिंग & इवेंट उप-सेवा सूची:\n• पारंपरिक दक्षिण/उत्तर भारतीय वेज बुफे: ₹349 / प्लेट\n• शाही हैदराबादी चिकन/मटन बिरयानी दावत: ₹450 / प्लेट\n• बच्चों की बर्थडे पार्टी स्नैक बॉक्स: ₹249 / प्लेट\n• 50-प्लेट बर्थडे खाना + बैलून डेकोर + साउंड सिस्टम: ₹6999\n• सत्यनारायण स्वामी पूजा सात्विक भोजन (बिना प्याज/लहसुन): ₹299 / प्लेट\n• कॉर्पोरेट बेंटो बॉक्स लंच: ₹199 / प्लेट\n\nFSSAI प्रमाणित स्वच्छ भोजन, क्रॉकरी व सर्विंग स्टाफ शामिल!',
        options: ['वेज बुफे बुक करें (₹349)', 'बिरयानी दावत (₹450)', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'catering-service', serviceName: 'Event & Bulk Catering Service', price: 299, serviceCategory: 'Food & Catering Services' }
      };
    } else if (language === 'TE') {
      return {
        reply: '🍲 డోర్‌లిన్ కేటరింగ్ & ఈవెంట్ సబ్-సర్వీసెస్ వివరాలు:\n• సాంప్రదాయ వెజ్ బుఫే (ప్లేట్ చొప్పున): ₹349\n• రాయల్ హైదరాబాదీ చికెన్/మటన్ బిర్యానీ ఫీస్ట్: ₹450 / ప్లేట్\n• పిల్లల బర్త్‌డే పార్టీ స్నాక్ బాక్స్: ₹249 / ప్లేట్\n• 50-ప్లేట్ల బర్త్‌డే భోజనం + బెలూన్ డెకర్ + సౌండ్ సిస్టమ్: ₹6999\n• సత్యనారాయణ స్వామి పూజ సాత్విక భోజనం (ఉల్లి/వెల్లుల్లి లేకుండా): ₹299 / ప్లేట్\n• కార్పొరేట్ బెంటో బాక్స్ లంచ్: ₹199 / ప్లేట్\n\nFSSAI గుర్తింపు పొందిన భోజనం, క్రాకరీ మరియు వడ్డించే వర్కర్లు ఉంటారు!',
        options: ['వెజ్ బుఫే బుక్ చేయండి (₹349)', 'బిర్యానీ ఫీస్ట్ (₹450)', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'catering-service', serviceName: 'Event & Bulk Catering Service', price: 299, serviceCategory: 'Food & Catering Services' }
      };
    } else {
      return {
        reply: '🍲 Doorlyn Event Catering Sub-Services List:\n• Traditional South/North Indian Veg Buffet: ₹349 / plate\n• Royal Hyderabadi Biryani & Non-Veg Feast: ₹450 / plate\n• Kid Birthday Party Snack Box Combo: ₹249 / plate\n• 50-Plate Birthday Catering + Balloon Decor + DJ Sound: ₹6999\n• Satyanarayana Swamy Satvik Pooja Catering (No Onion/Garlic): ₹299 / plate\n• Executive Corporate Bento Box Lunch: ₹199 / plate\n\nIncludes FSSAI food certification, premium crockery & server staff!',
        options: ['Book Veg Buffet (₹349)', 'Book Biryani Feast (₹450)', '📝 Open Full Booking Form'],
        action: { type: 'PROMPT_CONFIRM', serviceId: 'catering-service', serviceName: 'Event & Bulk Catering Service', price: 299, serviceCategory: 'Food & Catering Services' }
      };
    }
  }

  // Intent 8: Worker Marketplace
  if (isWorkerIntent) {
    if (language === 'HI') {
      return {
        reply: '👷 डोरलिन वर्कर मार्केटप्लेस उप-सेवा सूची:\n• सामान्य दिहाड़ी मजदूर (फुल डे 8 घंटे): ₹600 (हाफ डे 4 घंटे: ₹349)\n• हेड मिस्त्री / मेसन (8 घंटे): ₹900 (असिस्टेंट कुली: ₹650)\n• बाथरूम डीप स्क्रबिंग (प्रति बाथरूम): ₹499\n• किचन ऑयल डीग्रीसिंग व चिमनी सफाई: ₹799\n• फुल 2BHK घर की डीप क्लीनिंग: ₹1999\n• ओवरहेड 1000L पानी की टंकी सफाई: ₹599\n\nसभी वर्कर आधार-सत्यापित और प्रशिक्षित हैं!',
        options: ['दिहाड़ी मजदूर बुक करें (₹600)', 'हेड मिस्त्री (₹900)', 'घर की सफाई (₹1999)'],
        action: { type: 'BOOK_SERVICE', serviceId: 'daily-wage-worker', serviceName: 'Daily Wage Workers', price: 600, serviceCategory: 'Worker Marketplace' }
      };
    } else if (language === 'TE') {
      return {
        reply: '👷 డోర్‌లిన్ వర్కర్ మార్కెట్‌ప్లేస్ సబ్-సర్వీసెస్ వివరాలు:\n• సాధారణ దినసరి కూలీ (ఫుల్ డే 8 గంటలు): ₹600 (హాఫ్ డే 4 గంటలు: ₹349)\n• హెడ్ మేస్త్రీ / మేసన్ (8 గంటలు): ₹900 (అసిస్టెంట్ కూలీ: ₹650)\n• బాత్రూమ్ డీప్ స్క్రబ్బింగ్ (ప్రతి బాత్రూమ్): ₹499\n• కిచెన్ ఆయిల్ డీగ్రీసింగ్ & చిమ్నీ క్లీనింగ్: ₹799\n• ఫుల్ 2BHK ఇల్లు డీప్ క్లీనింగ్: ₹1999\n• ఓవర్‌హెడ్ 1000L వాటర్ ట్యాంక్ క్లీనింగ్: ₹599\n\nఅందరూ ఆధార్-ధృవీకరించబడిన వర్కర్లు!',
        options: ['దినసరి కూలీ బుక్ చేయండి (₹600)', 'హెడ్ మేస్త్రీ (₹900)', 'ఇల్లు క్లీనింగ్ (₹1999)'],
        action: { type: 'BOOK_SERVICE', serviceId: 'daily-wage-worker', serviceName: 'Daily Wage Workers', price: 600, serviceCategory: 'Worker Marketplace' }
      };
    } else {
      return {
        reply: '👷 Doorlyn Worker Marketplace Sub-Services List:\n• General Daily Wage Helper (Full Day 8h): ₹600 (Half Day 4h: ₹349)\n• Head Mason / Senior Mestri (8h): ₹900 (Assistant Helper: ₹650)\n• Bathroom Deep Scrubbing (Per Bath): ₹499\n• Kitchen Oil Degreasing & Chimney Clean: ₹799\n• Full 2BHK House Deep Cleaning: ₹1999\n• Overhead 1000L PVC Water Tank Cleaning: ₹599\n\nAll workers are police & Aadhaar verified!',
        options: ['Book Daily Labor (₹600)', 'Book Head Mason (₹900)', 'Book Deep Cleaning (₹1999)'],
        action: { type: 'BOOK_SERVICE', serviceId: 'daily-wage-worker', serviceName: 'Daily Wage Workers', price: 600, serviceCategory: 'Worker Marketplace' }
      };
    }
  }

  // Context-aware fallback: stay on the service being discussed
  if (lastContext) {
    const contextServiceMap = {
      electrician: { name: 'Electrician - Fan Repair & Wiring', price: '₹249', emoji: '⚡' },
      plumber: { name: 'Plumber - Pipe & Tap Repair', price: '₹199', emoji: '🔧' },
      tutor: { name: 'Home & Online Tutor Service', price: '₹299/hr', emoji: '📚' },
      healthcare: { name: 'CBC & Sugar Diagnostic Checkup', price: '₹349', emoji: '🏥' },
      parcel: { name: 'Small Parcel Pickup & Drop', price: '₹69', emoji: '📦' },
      shifting: { name: 'Local House Shifting', price: '₹2499', emoji: '🚚' },
      grocery: { name: '15-Min Express Grocery', price: '', emoji: '🛒' },
      catering: { name: 'Event & Bulk Catering', price: '₹299/plate', emoji: '🍲' },
      worker: { name: 'Daily Wage Workers', price: '₹600/day', emoji: '👷' }
    };
    const svc = contextServiceMap[lastContext] || { name: 'this service', price: '', emoji: '✅' };
    return {
      reply: language === 'HI'
        ? `${svc.emoji} आप ${svc.name} सेवा के बारे में बात कर रहे हैं (${svc.price})। क्या आप यह सेवा बुक करना चाहते हैं, कीमत जानना चाहते हैं, या समय स्लॉट चुनना चाहते हैं?`
        : language === 'TE'
        ? `${svc.emoji} మీరు ${svc.name} సేవ గురించి మాట్లాడుతున్నారు (${svc.price}). ఈ సేవను బుక్ చేయమంటారా, ధర తెలుసుకోవాలా, లేదా సమయం ఎంచుకోవాలా?`
        : `${svc.emoji} We're discussing ${svc.name} (${svc.price}). Would you like to:\n• Book this service now\n• Know the exact pricing\n• Choose a time slot\n\nJust let me know how to proceed!`,
      options: language === 'HI'
        ? ['अभी बुक करें', 'कीमत बताएं', 'समय चुनें']
        : language === 'TE'
        ? ['ఇప్పుడు బుక్ చేయండి', 'ధర చెప్పండి', 'సమయం ఎంచుకోండి']
        : ['Book Now', 'Show Price', 'Choose Time Slot']
    };
  }

  if (language === 'HI') {
    return {
      reply: 'नमस्ते! मैं अनुवादिनी.एआई द्वारा संचालित डोरलिन एआई सहायक हूँ। हमारी 8 सेवाएं:\n\n🏥 हेल्थकेयर & डायग्नोस्टिक्स (CBC, शुगर, फुल बॉडी चेकअप)\n🔧 होम रिपेयर (इलेक्ट्रीशियन, प्लंबर, कार्पेंटर)\n📦 पिकअप & ड्रॉप सर्विस (पार्सल, गिफ्ट, लगेज)\n🚚 लॉजिस्टिक्स & शिफ्टिंग (घर, ऑफिस, मिनी ट्रक)\n🛒 किराना & दैनिक जरूरतें (15 मिनट डिलीवरी)\n👷 वर्कर मार्केटप्लेस (मजदूर, मिस्त्री, सफाई)\n📚 स्टूडेंट ट्यूटर्स & सर्विसेज\n🍲 केटरिंग & इवेंट सपोर्ट\n\nआपको कौन सी सेवा चाहिए?',
      options: ['🏥 हेल्थकेयर', '🔧 होम रिपेयर', '📦 पिकअप & ड्रॉप', '🚚 शिफ्टिंग', '🛒 किराना', '👷 वर्कर्स', '📚 ट्यूटर्स', '🍲 केटरिंग']
    };
  } else if (language === 'TE') {
    return {
      reply: 'నమస్కారం! నేను అనువాదిని.ఏఐ ద్వారా ఆధారితమైన డోర్‌లిన్ ఏఐ అసిస్టెంట్. మా 8 సేవలు:\n\n🏥 హెల్త్‌కేర్ & డయాగ్నోస్టిక్స్ (CBC, షుగర్, ఫుల్ బాడీ చెకప్)\n🔧 ఇంటి రిపేర్లు (ఎలక్ట్రీషియన్, ప్లంబర్, కార్పెంటర్)\n📦 పికప్ & డ్రాప్ సర్వీస్ (పార్శిల్, గిఫ్ట్, లగేజ్)\n🚚 లాజిస్టిక్స్ & షిఫ్టింగ్ (ఇల్లు, ఆఫీస్, మినీ ట్రక్)\n🛒 గ్రోసరీ & నిత్యావసరాలు (15 నిమిషాల డెలివరీ)\n👷 వర్కర్ మార్కెట్‌ప్లేస్ (కూలీలు, మేస్త్రీ, క్లీనింగ్)\n📚 స్టూడెంట్ ట్యూటర్స్ & సర్వీసెస్\n🍲 కేటరింగ్ & ఈవెంట్ సపోర్ట్\n\nమీకు ఏ సేవ కావాలి?',
      options: ['🏥 హెల్త్‌కేర్', '🔧 ఇంటి రిపేర్లు', '📦 పికప్ & డ్రాప్', '🚚 షిఫ్టింగ్', '🛒 గ్రోసరీ', '👷 వర్కర్లు', '📚 ట్యూటర్స్', '🍲 కేటరింగ్']
    };
  } else {
    return {
      reply: 'Hello! I am Doorlyn AI powered by Anuvadini.ai. Our 8 service verticals:\n\n🏥 Healthcare & Diagnostics (CBC, Sugar, Full Body Checkup)\n🔧 Home Repairs (Electrician, Plumber, Carpenter)\n📦 Pickup & Drop Service (Parcel, Gift, Luggage)\n🚚 Logistics & Shifting (House, Office, Mini Truck)\n🛒 Groceries & Essentials (15-min Express Delivery)\n👷 Worker Marketplace (Daily Labor, Mason, Cleaning)\n📚 Student Tutors & Services\n🍲 Catering & Event Support\n\nWhich service would you like?',
      options: ['🏥 Healthcare', '🔧 Home Repairs', '📦 Pickup & Drop', '🚚 Shifting', '🛒 Groceries', '👷 Workers', '📚 Tutors', '🍲 Catering']
    };
  }
};

/**
 * Standalone/Reusable Doorlyn Text-to-Speech function
 * Speaks customer-facing natural language response using browser Web Speech API (SpeechSynthesis)
 */
export function speakDoorlynResponse(text, language = 'EN', onStart, onEnd, onError) {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis || null : null;
  if (!synth) {
    console.log('[TTS] error', 'speechSynthesis unsupported');
    if (onError) onError('SpeechSynthesis is not supported in this browser.', 'unsupported');
    return;
  }

  // Lifecycle Step 1: Cancel any previous speech before starting a new response
  stopDoorlynSpeech();

  const langVoiceMap = {
    EN: 'en-IN',
    HI: 'hi-IN',
    TE: 'te-IN'
  };

  const targetLang = langVoiceMap[language] || 'en-IN';

  // Clean raw text to ensure only customer-facing natural language is spoken
  const engine = new AnuvadiniVoiceEngine();
  let speechText = engine.cleanTextForSpeech(text);

  if (!speechText) {
    if (onEnd) onEnd();
    return;
  }

  const matchedVoice = engine.getFemaleVoice(language);

  const isNativeVoiceAvailable = matchedVoice && (
    (language === 'TE' && (matchedVoice.lang.includes('te') || matchedVoice.name.toLowerCase().includes('telugu'))) ||
    (language === 'HI' && (matchedVoice.lang.includes('hi') || matchedVoice.name.toLowerCase().includes('hindi')))
  );

  if (!isNativeVoiceAvailable && (language === 'TE' || language === 'HI')) {
    speechText = engine.getPhoneticTransliteration(speechText, language);
  }

  const utterance = new SpeechSynthesisUtterance(speechText);
  utterance.lang = matchedVoice ? matchedVoice.lang : targetLang;
  utterance.rate = 0.94;
  utterance.pitch = 1.18;

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    console.log('[TTS] started');
    console.log('[TTS] speaking', { lang: targetLang, text: speechText });
    if (onStart) onStart();
  };

  utterance.onend = () => {
    console.log('[TTS] stopped');
    if (onEnd) onEnd();
  };

  utterance.onerror = (err) => {
    console.log('[TTS] error', err.error || err);
    console.log('[TTS] stopped');
    if (onError) onError(err);
    if (onEnd) onEnd();
  };

  synth.speak(utterance);
}

/**
 * Stops any ongoing TTS speech immediately
 */
export function stopDoorlynSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
      console.log('[TTS] stopped');
    } catch (e) {
      console.log('[TTS] error', e.message);
    }
  }
}

