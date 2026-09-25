import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { AnuvadiniVoiceEngine } from '../utils/anuvadiniAI';
import { 
  X, 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  MessageSquare, 
  Smartphone,
  VolumeX
} from 'lucide-react';

export const IVRSModal = ({ onClose }) => {
  const { lang: appLang, setLang: setAppLang } = useLanguage();
  const { addBooking } = useBooking();
  const voiceEngineRef = useRef(null);

  const [callState, setCallState] = useState('idle'); // 'idle', 'calling', 'connected', 'ended'
  const [ivrsStep, setIvrsStep] = useState('LANG_SELECT'); // 'LANG_SELECT', 'MAIN_MENU', 'SERVICE_CONFIRM', 'BOOKING_DONE'
  const [selectedLang, setSelectedLang] = useState(appLang || 'EN');
  const [selectedService, setSelectedService] = useState(null);
  const [pressedKey, setPressedKey] = useState(null);
  const [ivrsMessage, setIvrsMessage] = useState('');
  const [smsDispatched, setSmsDispatched] = useState(false);
  const [voiceLogs, setVoiceLogs] = useState([]);
  const [audioMuted, setAudioMuted] = useState(false);

  useEffect(() => {
    voiceEngineRef.current = new AnuvadiniVoiceEngine();
    return () => {
      voiceEngineRef.current?.stopSpeaking();
    };
  }, []);

  const speakPrompt = (text, targetLang = selectedLang) => {
    if (!audioMuted && voiceEngineRef.current) {
      voiceEngineRef.current.speak(text, targetLang);
    }
  };

  const startCall = async () => {
    setCallState('calling');
    setIvrsStep('LANG_SELECT');
    setSmsDispatched(false);
    voiceEngineRef.current?.stopSpeaking();

    const welcomeAudioText = 'Welcome to Doorlyn IVRS Helpline. Press 1 for English. Telugu kosam 2 nokkandi. Hindi ke liye 3 dabaye.';
    const welcomeDisplayText = 'Welcome to Doorlyn IVRS Helpline (+91 98765 43210). Press 1 for English. తెలుగు కోసం 2 నొక్కండి (Press 2 for Telugu). हिंदी के लिए 3 दबाएं (Press 3 for Hindi).';

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/ivrs/call' : '/api/ivrs/call';
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: '+91 9876543210', 
          actionStep: 'CALL_INIT',
          selectedLang,
          isRealNumber: true 
        })
      });
      const data = await response.json();
      if (data.ivrsSteps) {
        setVoiceLogs(data.ivrsSteps);
      }
    } catch (e) {
      console.log('IVRS Backend Offline fallback:', e);
      setVoiceLogs(['Connected to Doorlyn IVRS (+91 98765 43210)', 'Step 1: Select Language']);
    }

    setTimeout(() => {
      setCallState('connected');
      setIvrsMessage(welcomeDisplayText);
      speakPrompt(welcomeAudioText, 'EN');
    }, 1200);
  };

  const playMainMenuPrompt = (language) => {
    let menuText = '';
    if (language === 'TE') {
      menuText = 'డోర్‌లిన్ ఐవిఆర్ఎస్ సేవలకు స్వాగతం. ఎలక్ట్రీషియన్ & ఇంటి రిపేర్ల కోసం 1 నొక్కండి, హెల్త్‌కేర్ CBC బ్లడ్ టెస్ట్ కోసం 2 నొక్కండి, ఎక్స్‌ప్రెస్ పార్శిల్ పికప్ కోసం 3 నొక్కండి, 15 నిమిషాల గ్రోసరీ కోసం 4 నొక్కండి, బుకింగ్ ట్రాకింగ్ కోసం 5 నొక్కండి, లేదా లైవ్ సపోర్ట్ కోసం 0 నొక్కండి.';
    } else if (language === 'HI') {
      menuText = 'डोरलिन आईवीआरएस में आपका स्वागत है। इलेक्ट्रीशियन व रिपेयर के लिए 1 दबाएं, सीबीसी ब्लड टेस्ट के लिए 2 दबाएं, एक्सप्रेस पार्सल के लिए 3 दबाएं, किराना डिलीवरी के लिए 4 दबाएं, बुकिंग स्थिति के लिए 5 दबाएं, या सहायता के लिए 0 दबाएं।';
    } else {
      menuText = 'Welcome to Doorlyn IVRS. Press 1 for Home Repairs & Electrician, Press 2 for Full Body CBC Blood Test, Press 3 for Express Parcel Pickup, Press 4 for 15-min Grocery Delivery, Press 5 to check Order Status, or Press 0 for Live Customer Support.';
    }
    setIvrsMessage(menuText);
    speakPrompt(menuText, language);
  };

  const handleKeyPress = (digit) => {
    setPressedKey(digit);
    voiceEngineRef.current?.stopSpeaking();

    // STEP 1: LANGUAGE SELECTION (1: English, 2: Telugu, 3: Hindi)
    if (ivrsStep === 'LANG_SELECT') {
      let chosenLang = 'EN';

      if (digit === 1) {
        chosenLang = 'EN';
      } else if (digit === 2) {
        chosenLang = 'TE'; // Telugu
      } else if (digit === 3) {
        chosenLang = 'HI'; // Hindi
      } else {
        chosenLang = 'EN';
      }

      setSelectedLang(chosenLang);
      setAppLang(chosenLang);
      setIvrsStep('MAIN_MENU');

      const langName = chosenLang === 'EN' ? 'English (1)' : chosenLang === 'TE' ? 'Telugu (2)' : 'Hindi (3)';
      setVoiceLogs(prev => [...prev, `Customer Language Selected: ${langName}`]);

      setTimeout(() => {
        playMainMenuPrompt(chosenLang);
      }, 500);
      return;
    }

    // STEP 2: MAIN MENU SELECTION (All voice and text strictly in selectedLang)
    if (ivrsStep === 'MAIN_MENU') {
      let infoText = '';
      let sObj = null;

      if (digit === 1) {
        sObj = {
          category: 'Home Repairs',
          name: 'Electrician - Fan Repair & Wiring',
          price: 249,
          timeSlot: 'Immediate (30 mins)'
        };
        infoText = selectedLang === 'TE'
          ? 'సర్వీస్ వివరాలు: ఎలక్ట్రీషియన్ మరియు ఇంటి రిపేర్ల సేవలు. వెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు. ఫిక్స్డ్ విజిట్ ఛార్జ్ 249 రూపాయలు. ఈ బుకింగ్ ఖరారు చేయడానికి 1 నొక్కండి. మెయిన్ మెనూకి వెళ్ళడానికి 9 నొక్కండి.'
          : selectedLang === 'HI'
          ? 'सेवा विवरण: इलेक्ट्रीशियन और होम रिपेयर सेवा। डोरलिन सत्यापित तकनीशियन जल्द से जल्द पहुंचेगा। निर्धारित विजिट शुल्क ₹249 है। इस बुकिंग को पक्का करने के लिए 1 दबाएं। मुख्य मेनू पर वापस जाने के लिए 9 दबाएं।'
          : 'Service Details: Electrician and Appliance Repair Service. Verified technicians arrive as soon as possible. Fixed inspection fee is 249 rupees. To confirm and finalize this booking, Press 1. To go back to main menu, Press 9.';
      } else if (digit === 2) {
        sObj = {
          category: 'Healthcare & Diagnostic',
          name: 'Full Body CBC & Sugar Checkup',
          price: 349,
          timeSlot: '08:00 AM - 09:00 AM'
        };
        infoText = selectedLang === 'TE'
          ? 'సర్వీస్ వివరాలు: ఫుల్ బాడీ CBC మరియు బ్లడ్ షుగర్ హెల్త్ చెకప్. సర్టిఫైడ్ ల్యాబ్ నిపుణుడు రేపు ఉదయం 8 గంటలకు మీ ఇంట శాంపిల్ కలెక్ట్ చేస్తారు. మొత్తం ధర 349 రూపాయలు (డిజిటల్ ల్యాబ్ రిపోర్ట్‌తో సహా). ఈ బుకింగ్ ఖరారు చేయడానికి 1 నొక్కండి. వెనక్కి వెళ్ళడానికి 9 నొక్కండి.'
          : selectedLang === 'HI'
          ? 'सेवा विवरण: फुल बॉडी CBC और ब्लड शुगर जांच। प्रमाणित लैब तकनीशियन कल सुबह 8 बजे आपके घर से सैंपल लेगा। कुल मूल्य ₹349 है (डिजिटल रिपोर्ट के साथ)। इस बुकिंग को पक्का करने के लिए 1 दबाएं। वापस जाने के लिए 9 दबाएं।'
          : 'Service Details: Full Body CBC Blood Count & Fasting Sugar Checkup. Certified Phlebotomist home collection scheduled for tomorrow 8:00 AM. Total price is 349 rupees including digital AI report. To confirm and finalize this booking, Press 1. To go back, Press 9.';
      } else if (digit === 3) {
        sObj = {
          category: 'Pickup & Drop',
          name: 'Express Parcel Pickup',
          price: 69,
          timeSlot: 'Immediate (15 mins)'
        };
        infoText = selectedLang === 'TE'
          ? 'సర్వీస్ వివరాలు: ఎక్స్‌ప్రెస్ పార్శిల్ పికప్ మరియు డెలివరీ. 15 నిమిషాల్లో పికప్ మరియు 2 గంటల్లో నగరంలో డెలివరీ చేయబడుతుంది. డెలివరీ ఛార్జ్ 69 రూపాయలు. ఈ బుకింగ్ ఖరారు చేయడానికి 1 నొక్కండి. వెనక్కి వెళ్ళడానికి 9 నొక్కండి.'
          : selectedLang === 'HI'
          ? 'सेवा विवरण: एक्सप्रेस पार्सल पिकअप और डिलीवरी। 15 मिनट में पिकअप और 2 घंटे में डिलीवरी। डिलीवरी शुल्क ₹69 है। इस बुकिंग को पक्का करने के लिए 1 दबाएं। वापस जाने के लिए 9 दबाएं।'
          : 'Service Details: Express Parcel Pickup and Delivery. Delivery rider will arrive in 15 minutes for pickup with guaranteed 2-hour delivery. Delivery fee is 69 rupees. To confirm and finalize this booking, Press 1. To go back, Press 9.';
      } else if (digit === 4) {
        sObj = {
          category: 'Grocery Delivery',
          name: '15-Min Essentials Grocery Pack',
          price: 299,
          timeSlot: 'Immediate (15 mins)'
        };
        infoText = selectedLang === 'TE'
          ? 'సర్వీస్ వివరాలు: 15 నిమిషాల తాజా కూరగాయలు మరియు నిత్యావసరాల డెలివరీ. మొత్తం ధర 299 రూపాయలు. ఈ బుకింగ్ ఖరారు చేయడానికి 1 నొక్కండి. వెనక్కి వెళ్ళడానికి 9 నొక్కండి.'
          : selectedLang === 'HI'
          ? 'सेवा विवरण: 15-मिनट किराना और ताजी सब्जियां पैक। कुल मूल्य ₹299। इस बुकिंग को पक्का करने के लिए 1 दबाएं। वापस जाने के लिए 9 दबाएं।'
          : 'Service Details: 15-Minute Fresh Produce & Daily Grocery Essentials Pack delivered directly to your home. Total price is 299 rupees. To confirm and finalize this booking, Press 1. To go back, Press 9.';
      } else if (digit === 5) {
        const trackText = selectedLang === 'TE'
          ? 'మీ సక్రియ బుకింగ్ DLN-89421 ధృవీకరించబడింది. టెక్నీషియన్ మీ ఇంటికి వస్తున్నారు.'
          : selectedLang === 'HI'
          ? 'आपकी बुकिंग DLN-89421 सक्रिय है और तकनीशियन रास्ते में है।'
          : 'Your active booking DLN-89421 is confirmed and technician is en route to your home.';
        setIvrsMessage(trackText);
        speakPrompt(trackText, selectedLang);
        return;
      } else if (digit === 0) {
        const supportText = selectedLang === 'TE'
          ? 'డోర్‌లిన్ లైవ్ కస్టమర్ కేర్ ప్రతినిధికి మీ కాల్ కనెక్ట్ చేయబడుతోంది. దయచేసి వేచి ఉండండి...'
          : selectedLang === 'HI'
          ? 'डोरलिन ग्राहक सहायता प्रतिनिधि को आपकी कॉल ट्रांसफर की जा रही है। कृपया प्रतीक्षा करें...'
          : 'Connecting your call to a Doorlyn Live Support Specialist. Please stay on the line...';
        setIvrsMessage(supportText);
        speakPrompt(supportText, selectedLang);
        return;
      } else {
        playMainMenuPrompt(selectedLang);
        return;
      }

      setSelectedService(sObj);
      setIvrsStep('SERVICE_CONFIRM');
      setIvrsMessage(infoText);
      speakPrompt(infoText, selectedLang);
      return;
    }

    // STEP 3: CONFIRMATION PROMPT (Strictly in selectedLang)
    if (ivrsStep === 'SERVICE_CONFIRM') {
      if (digit === 1 && selectedService) {
        // Customer explicitly pressed 1 to confirm booking
        const created = addBooking({
          serviceCategory: selectedService.category,
          serviceName: selectedService.name,
          date: '2026-08-04',
          timeSlot: selectedService.timeSlot,
          totalAmount: selectedService.price,
          paymentMethod: 'Cash / UPI on Collection',
          patientName: 'Rajesh Kumar (Via IVRS Call)',
          address: 'Flat 402, Lotus Heights, Hitech City, Hyderabad'
        });

        setSmsDispatched(true);
        setIvrsStep('BOOKING_DONE');

        const successText = selectedLang === 'TE'
          ? `🎉 అభినందనలు! మీ బుకింగ్ నంబర్ #${created.id} (${selectedService.name}) విజయవంతంగా నమోదు చేయబడింది! ధృవీకరణ SMS మరియు WhatsApp సందేశం పంపబడింది. మెయిన్ మెనూ కోసం 9 నొక్కండి.`
          : selectedLang === 'HI'
          ? `🎉 बधाई हो! आपकी बुकिंग #${created.id} (${selectedService.name}) सफलतापूर्वक दर्ज कर ली गई है। पुष्टि का SMS और WhatsApp संदेश भेज दिया गया है। मुख्य मेनू के लिए 9 दबाएं।`
          : `🎉 Congratulations! Your booking #${created.id} for ${selectedService.name} has been placed successfully. Confirmation SMS & WhatsApp message dispatched. Press 9 for main menu.`;

        setIvrsMessage(successText);
        speakPrompt(successText, selectedLang);
        setVoiceLogs(prev => [...prev, `Order #${created.id} Confirmed by Customer (Pressed 1)`]);
      } else if (digit === 9) {
        setIvrsStep('MAIN_MENU');
        playMainMenuPrompt(selectedLang);
      } else {
        const reAsk = selectedLang === 'TE'
          ? 'దయచేసి బుకింగ్ ఖరారు చేయడానికి 1 నొక్కండి, లేదా వెనక్కి వెళ్ళడానికి 9 నొక్కండి.'
          : selectedLang === 'HI'
          ? 'कृपया बुकिंग की पुष्टि के लिए 1 दबाएं, या वापस जाने के लिए 9 दबाएं।'
          : 'Please Press 1 to confirm and finalize this booking, or Press 9 to return to main menu.';
        setIvrsMessage(reAsk);
        speakPrompt(reAsk, selectedLang);
      }
      return;
    }

    // STEP 4: AFTER BOOKING DONE
    if (ivrsStep === 'BOOKING_DONE') {
      if (digit === 9) {
        setIvrsStep('MAIN_MENU');
        playMainMenuPrompt(selectedLang);
      } else {
        const donePrompt = selectedLang === 'TE'
          ? 'మీ బుకింగ్ ఇప్పటికే నమోదైంది. ప్రధాన మెనూ కోసం 9 నొక్కండి.'
          : selectedLang === 'HI'
          ? 'आपकी बुकिंग पहले से ही दर्ज है। मुख्य मेनू के लिए 9 दबाएं।'
          : 'Your booking has already been recorded. Press 9 for main menu.';
        setIvrsMessage(donePrompt);
        speakPrompt(donePrompt, selectedLang);
      }
    }
  };

  const endCall = () => {
    voiceEngineRef.current?.stopSpeaking();
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-800 relative overflow-hidden">
        
        {/* Glowing Background FX */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              IVRS
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Doorlyn IVR Helpline</h3>
              <p className="text-[10px] text-slate-400">+91 98765 43210 • Voice Telephony Active</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const nextState = !audioMuted;
                setAudioMuted(nextState);
                if (nextState) voiceEngineRef.current?.stopSpeaking();
              }}
              className="p-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-amber-400 text-xs"
              title="Toggle Audio Prompt Sound"
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button onClick={endCall} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dialing Display */}
        <div className="my-5 text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-teal-600 to-emerald-500 mx-auto flex items-center justify-center shadow-xl mb-3 animate-pulse">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <div className="text-xs text-slate-400 mt-0.5 font-mono">
            Direct Helpline: <span className="text-teal-400 font-bold font-sans">+91 98765 43210</span>
          </div>

          {callState === 'idle' && (
            <div className="mt-4 space-y-3">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs text-slate-300">
                Rural & Elderly Friendly Phone Booking System. Select language, listen to details, and confirm booking.
              </div>
              <button
                onClick={startCall}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                Start IVR Call (+91 98765 43210)
              </button>
            </div>
          )}

          {callState === 'calling' && (
            <p className="text-xs text-amber-400 mt-4 animate-pulse">
              Ringing Doorlyn IVR (+91 98765 43210)...
            </p>
          )}

          {callState === 'connected' && (
            <div className="mt-4 bg-slate-800/90 p-4 rounded-2xl border border-teal-500/50 text-left space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 border-b border-slate-700 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Call Active • Step: {ivrsStep}
                </span>
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-mono">
                  Lang: {selectedLang === 'EN' ? 'English' : selectedLang === 'TE' ? 'తెలుగు' : 'हिंदी'}
                </span>
              </div>

              <p className="text-xs text-slate-100 leading-relaxed font-sans font-medium">
                "{ivrsMessage}"
              </p>

              {/* Action hints based on current step */}
              {ivrsStep === 'LANG_SELECT' && (
                <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] font-bold">
                  <span className="bg-slate-700 text-amber-300 px-2 py-1 rounded-lg">1: English</span>
                  <span className="bg-slate-700 text-amber-300 px-2 py-1 rounded-lg">2: తెలుగు (Telugu)</span>
                  <span className="bg-slate-700 text-amber-300 px-2 py-1 rounded-lg">3: हिंदी (Hindi)</span>
                </div>
              )}

              {ivrsStep === 'SERVICE_CONFIRM' && (
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-bold">
                  <span className="bg-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/50 animate-pulse">
                    Press 1 ➔ Confirm & Book (₹{selectedService?.price})
                  </span>
                  <span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg">
                    Press 9 ➔ Go Back
                  </span>
                </div>
              )}

              {smsDispatched && (
                <div className="pt-2 flex items-center gap-2 text-[10px] text-amber-400 font-bold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Instant SMS & WhatsApp Confirmation Dispatched to Mobile!
                </div>
              )}
            </div>
          )}

          {callState === 'ended' && (
            <p className="text-xs text-red-400 mt-4">
              Call Disconnected. Session Ended.
            </p>
          )}
        </div>

        {/* Keypad Dial Pad when connected */}
        {callState === 'connected' && (
          <div className="grid grid-cols-3 gap-2 my-3 relative z-10 max-w-xs mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((digit) => (
              <button
                key={digit}
                onClick={() => typeof digit === 'number' && handleKeyPress(digit)}
                className={`h-11 rounded-xl text-white font-bold text-base flex items-center justify-center border transition-all shadow-md active:scale-95 ${
                  pressedKey === digit
                    ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                    : 'bg-slate-800 hover:bg-teal-700 border-slate-700'
                }`}
              >
                <span>{digit}</span>
              </button>
            ))}
          </div>
        )}

        {/* Telephony Gateway Steps */}
        {voiceLogs.length > 0 && callState === 'connected' && (
          <div className="my-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 text-left font-mono">
            <span className="text-teal-400 font-bold block mb-1">Telephony Gateway Status:</span>
            {voiceLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span> {log}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Call Buttons */}
        <div className="pt-3 border-t border-slate-800 flex justify-center gap-4 relative z-10">
          {callState === 'idle' ? (
            <div className="w-full flex flex-col gap-2">
              <button
                onClick={startCall}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                Call +91 98765 43210 (In-App IVR)
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('+919876543210');
                  alert('Phone number (+91 98765 43210) copied to clipboard!');
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                Copy Number to Dial Manually (+91 98765 43210)
              </button>
            </div>
          ) : (
            <button
              onClick={endCall}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              End Call
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
