import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { AnuvadiniVoiceEngine, processAIIntent, speakDoorlynResponse, stopDoorlynSpeech } from '../utils/anuvadiniAI';
import { generateDoorlynAIResponse } from '../services/aiKnowledgeService';
import { DoorlynTools } from '../services/doorlynTools';
import { ProviderCard } from '../components/ai/ProviderCard';
import { BookingConfirmationCard } from '../components/ai/BookingConfirmationCard';
import { VoiceStatusIndicator } from '../components/ai/VoiceStatusIndicator';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Truck,
  RotateCcw,
  Database,
  Square,
  ShieldCheck
} from 'lucide-react';

export const AssistantView = ({ onTriggerBooking, onOpenHealthRecords }) => {
  const { lang, setLang, t } = useLanguage();
  const { addBooking, setActiveTrackingOrder, bookings } = useBooking();
  const { user } = useAuth();
  const voiceEngineRef = useRef(null);

  const speechTextRef = useRef('');
  const isManualStopRef = useRef(false);

  const [voiceState, setVoiceState] = useState('IDLE'); // 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR'
  const [micStatusMsg, setMicStatusMsg] = useState('');
  const [autoVoiceTTS, setAutoVoiceTTS] = useState(true);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  const [pendingConfirmation, setPendingConfirmation] = useState(null); // Active booking pending explicit user confirmation

  const chatBottomRef = useRef(null);

  const getInitialGreeting = (l) => {
    if (l === 'TE') {
      return {
        id: Date.now(),
        sender: 'ai',
        text: 'నమస్కారం! నేను డోర్‌లిన్ ఏఐ వాయిస్ అసిస్టెంట్. మా 8 ప్రధాన గృహ సేవలు:\n\n1. 🏥 హెల్త్‌కేర్ & డయాగ్నోస్టిక్స్ (CBC, బ్లడ్ షుగర్, ఫుల్ బాడీ చెకప్)\n2. 🔧 ఇంటి రిపేర్లు (ఎలక్ట్రీషియన్ ₹249, ప్లంబర్ ₹199, కార్పెంటర్)\n3. 📦 పికప్ & డ్రాప్ సేవలు (పార్శిల్, గిఫ్ట్, లగేజ్ ₹69 నుండి)\n4. 🚚 లాజిస్టిక్స్ & షిఫ్టింగ్ (ఇల్లు, ఆఫీస్, మినీ ట్రక్ ₹2499 నుండి)\n5. 🛒 గ్రోసరీ & నిత్యావసరాలు (15 నిమిషాల డెలివరీ)\n6. 👷 వర్కర్ మార్కెట్‌ప్లేస్ (కూలీలు ₹600/రోజు, మేస్త్రీ, క్లీనింగ్)\n7. 📚 స్టూడెంట్ ట్యూటర్స్ (1st-10th & ఇంటర్మీడియట్ ట్యూషన్)\n8. 🍲 కేటరింగ్ & ఈవెంట్ సేవలు (వివాహాలు & వేడుకల భోజనం)\n\nమీకు ఏ సేవ అవసరమో చెప్పండి లేదా టైప్ చేయండి!',
        options: ['🏥 హెల్త్‌కేర్', '🔧 ఇంటి రిపేర్లు', '📦 పికప్ & డ్రాప్', '🚚 షిఫ్టింగ్', '🛒 గ్రోసరీ', '👷 వర్కర్లు', '📚 ట్యూటర్స్', '🍲 కేటరింగ్'],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
    if (l === 'HI') {
      return {
        id: Date.now(),
        sender: 'ai',
        text: 'नमस्ते! मैं डोरलिन AI वॉयस सहायक हूँ। हमारी 8 प्रमुख घरेलू सेवाएं:\n\n1. 🏥 हेल्थकेयर & डायग्नोस्टिक्स (CBC, ब्लड शुगर, फुल बॉडी चेकअप)\n2. 🔧 होम रिपेयर & किचन (इलेक्ट्रीशियन ₹249, प्लंबर ₹199, कारपेंटर)\n3. 📦 पिकअप & ड्रॉप सेवा (पार्सल, गिफ्ट, लगेज ₹69 से)\n4. 🚚 लॉजिस्टिक्स & शिफ्टिंग (घर, ऑफिस शिफ्टिंग, मिनी ट्रक ₹2499 से)\n5. 🛒 किराना & राशन (15 मिनट एक्सप्रेस डिलीवरी)\n6. 👷 वर्कर मार्केटप्लेस (दिहाड़ी मजदूर ₹600/दिन, मिस्त्री, सफाई)\n7. 📚 स्टूडेंट ट्यूटर्स & सेवाएं (होम व ऑनलाइन ट्यूटर)\n8. 🍲 कैटरिंग & इवेंट सपोर्ट (शादी व पार्टी बुफे)\n\nआप किस सेवा के बारे में जानना या बुक करना चाहते हैं?',
        options: ['🏥 हेल्थकेयर', '🔧 होम रिपेयर', '📦 पिकअप & ड्रॉप', '🚚 शिफ्टिंग', '🛒 किराना', '👷 वर्कर्स', '📚 ट्यूटर्स', '🍲 कैटरिंग'],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
    return {
      id: Date.now(),
      sender: 'ai',
      text: 'Hello! I am Doorlyn AI Voice Assistant powered by Anuvadini.ai. Our 8 doorstep service verticals:\n\n1. 🏥 Healthcare & Diagnostics (CBC, Sugar, Full Body Checkup)\n2. 🔧 Home Repairs & Kitchen (Electricians ₹249, Plumbers ₹199, Carpenters)\n3. 📦 Pickup & Drop Service (Express Documents, Parcels & Luggage from ₹69)\n4. 🚚 Logistics & Shifting (1BHK/2BHK House Relocation, Mini Trucks from ₹2499)\n5. 🛒 Groceries & Essentials (15-min Express Delivery)\n6. 👷 Worker Marketplace (Verified Daily Wage Labor ₹600/day, Masons, Deep Cleaning)\n7. 📚 Student Tutors & Services (1st-10th & Intermediate Tutors from ₹299/hr)\n8. 🍲 Catering & Event Support (Wedding & Event Buffets from ₹299/plate)\n\nHow can I help you today?',
      options: ['🏥 Healthcare', '🔧 Home Repairs', '📦 Pickup & Drop', '🚚 Shifting', '🛒 Groceries', '👷 Workers', '📚 Tutors', '🍲 Catering'],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('doorlyn_ai_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.log('Failed to load saved chat history:', e);
    }
    return [getInitialGreeting('EN')];
  });

  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    voiceEngineRef.current = new AnuvadiniVoiceEngine();
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('doorlyn_ai_chat_messages', JSON.stringify(messages));
    } catch {}
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const stopSpeaking = () => {
    stopDoorlynSpeech();
    if (voiceEngineRef.current) {
      voiceEngineRef.current.stopSpeaking();
    }
    setSpeakingMessageId(null);
    if (voiceState === 'SPEAKING') {
      setVoiceState('IDLE');
    }
  };

  const handleSpeakMessage = (msg) => {
    stopSpeaking();

    if (!msg || !msg.text) return;

    setSpeakingMessageId(msg.id);
    setVoiceState('SPEAKING');

    speakDoorlynResponse(
      msg.text,
      lang,
      () => {
        setSpeakingMessageId(msg.id);
        setVoiceState('SPEAKING');
      },
      () => {
        setSpeakingMessageId(null);
        setVoiceState('IDLE');
      },
      (err) => {
        console.log('[TTS] error', err);
        setSpeakingMessageId(null);
        setVoiceState('IDLE');
      }
    );
  };

  const clearChatHistory = () => {
    stopSpeaking();
    try {
      sessionStorage.removeItem('doorlyn_ai_chat_messages');
    } catch {}
    setPendingConfirmation(null);
    setMessages([getInitialGreeting(lang)]);
  };

  const quickVoiceChips = [
    { label: '🎤 "I need a plumber tomorrow"', text: 'I need a plumber tomorrow' },
    { label: '🎤 "నాకు రేపు ఒక ప్లంబర్ కావాలి"', text: 'నాకు రేపు ఒక ప్లంబర్ కావాలి' },
    { label: '🎤 "मुझे कल एक प्लंबर चाहिए"', text: 'मुझे कल एक प्लंबर चाहिए' },
    { label: '🎤 "Book CBC blood test"', text: 'I need a CBC blood test at my home' },
    { label: '🎤 "House Shifting Mini Truck"', text: 'I need house shifting relocation with mini truck' }
  ];

  const stopSpeakingAndAsk = () => {
    stopSpeaking();
    if (voiceState !== 'LISTENING') {
      toggleMicListening();
    }
  };

  // Main Handle Send Message Loop
  const handleSend = async (overrideText = null) => {
    stopSpeaking();

    const textToSend = overrideText || inputVal;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!overrideText) setInputVal('');
    setIsApiLoading(true);
    setVoiceState('PROCESSING');

    const lowerInput = textToSend.toLowerCase();

    // Multilingual Auto Language Switcher
    if (lowerInput.includes('తెలుగులో మాట్లాడండి') || lowerInput.includes('తెలుగు') || lowerInput.includes('telugu')) {
      if (lang !== 'TE') setLang('TE');
    } else if (lowerInput.includes('हिंदी में बात करो') || lowerInput.includes('हिंदी') || lowerInput.includes('hindi')) {
      if (lang !== 'HI') setLang('HI');
    } else if (lowerInput.includes('speak in english') || lowerInput.includes('english')) {
      if (lang !== 'EN') setLang('EN');
    }

    const chatHistory = updatedMessages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    // Check for Explicit Confirmation Commands ("yes", "confirm", "అవును", "हां") when pendingConfirmation exists
    if (pendingConfirmation && (lowerInput.includes('yes') || lowerInput.includes('confirm') || lowerInput.includes('अॉफर') || lowerInput.includes('हां') || lowerInput.includes('అవును') || lowerInput.includes('కన్ఫర్మ్'))) {
      const created = addBooking({
        serviceCategory: pendingConfirmation.serviceCategory,
        serviceName: pendingConfirmation.serviceName,
        date: pendingConfirmation.date || new Date().toISOString().split('T')[0],
        timeSlot: pendingConfirmation.timeSlot || '10:00 AM - 12:00 PM',
        totalAmount: pendingConfirmation.price,
        paymentMethod: 'Cash / UPI on Collection',
        patientName: pendingConfirmation.serviceCategory === 'Healthcare & Diagnostic' ? (user?.name || 'Rajesh Kumar') : null,
        address: pendingConfirmation.address || user?.address || 'Flat 402, Lotus Heights, Hitech City, Hyderabad'
      });

      const activeConf = pendingConfirmation;
      setPendingConfirmation(null);

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: lang === 'TE'
          ? `🎉 బుకింగ్ విజయవంతంగా కన్ఫర్మ్ అయింది! ఆర్డర్ #${created.id} నమోదైంది.\n\n• సేవ: ${created.serviceName}\n• తేదీ & సమయం: ${created.date} (${created.timeSlot})\n• అడ్రస్: ${created.address}\n• మొత్తం: ₹${created.totalAmount} (UPI / Cash)\n\nమా వెరిఫైడ్ పార్ట్‌నర్ మీ వద్దకు రానున్నారు!`
          : lang === 'HI'
          ? `🎉 बुकिंग सफलतापूर्वक कन्फर्म हो गई है! ऑर्डर #${created.id} दर्ज हो गया।\n\n• सेवा: ${created.serviceName}\n• तिथि व समय: ${created.date} (${created.timeSlot})\n• पता: ${created.address}\n• कुल: ₹${created.totalAmount} (UPI / Cash)\n\nहमारा सत्यापित पार्टनर आपके स्थान पर पहुंचेगा!`
          : `🎉 Booking Confirmed Successfully! Order #${created.id} has been registered.\n\n• Service: ${created.serviceName}\n• Date & Time: ${created.date} (${created.timeSlot})\n• Delivery Address: ${created.address}\n• Amount Payable: ₹${created.totalAmount} (Pay on Service)\n\nOur verified partner agent has been assigned to your booking!`,
        options: lang === 'TE' ? ['ఆర్డర్ ట్రాక్ చేయండి', 'మరో సేవ బుక్ చేయండి'] : lang === 'HI' ? ['ऑर्डर ट्रैक करें', 'दूसरी सेवा बुक करें'] : ['Track Order Status', 'Book Another Service'],
        createdBooking: created,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsApiLoading(false);
      setVoiceState('IDLE');

      if (autoVoiceTTS) {
        handleSpeakMessage(aiMsg);
      }
      return;
    }

    try {
      // 1. Search Knowledge Base via Supabase / Local
      const knowledgeResponse = await generateDoorlynAIResponse(textToSend, lang, chatHistory);

      let replyText = '';
      let options = [];
      let action = null;
      let createdBookingObj = null;
      let providersToDisplay = null;
      let requiresConfirmationCard = false;
      let confirmationCardData = null;

      // 2. Check for Provider Search Intent ("plumber", "electrician", "providers", "find plumber")
      if (lowerInput.includes('plumber') || lowerInput.includes('electrician') || lowerInput.includes('provider') || lowerInput.includes('ప్లంబర్') || lowerInput.includes('ఎలక్ట్రీషియన్') || lowerInput.includes('प्लंबर') || lowerInput.includes('इलेक्ट्रीशियन')) {
        const catFilter = lowerInput.includes('plumber') || lowerInput.includes('ప్లంబర్') || lowerInput.includes('प्लंबर') ? 'plumbing-services' : 'electrician-services';
        const pRes = await DoorlynTools.searchProviders({ serviceId: catFilter });
        if (pRes.success && pRes.providers.length > 0) {
          providersToDisplay = pRes.providers;
        }
      }

      // 3. Sync with Backend Express Server if active
      try {
        let response;
        try {
          response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: textToSend, language: lang, history: chatHistory, address: user?.address })
          });
        } catch {
          response = await fetch('http://localhost:3000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: textToSend, language: lang, history: chatHistory, address: user?.address })
          });
        }

        const data = await response.json();
        if (data.success && data.reply) {
          replyText = knowledgeResponse.knowledge ? knowledgeResponse.reply : data.reply;
          options = (knowledgeResponse.knowledge ? knowledgeResponse.options : data.options) || fallbackIntent.options;
          action = (knowledgeResponse.knowledge ? knowledgeResponse.suggestedAction : data.suggestedAction) || fallbackIntent.action;
        } else {
          const fallback = processAIIntent(textToSend, lang, chatHistory);
          replyText = fallback.reply;
          options = fallback.options;
          action = fallback.action;
        }
      } catch {
        const fallback = processAIIntent(textToSend, lang, chatHistory);
        replyText = knowledgeResponse.knowledge ? knowledgeResponse.reply : fallback.reply;
        options = knowledgeResponse.options || fallback.options;
        action = knowledgeResponse.suggestedAction || fallback.action;
      }

      // Check if this intent requires explicit booking confirmation prompt
      if (action && action.type === 'PROMPT_CONFIRM') {
        requiresConfirmationCard = true;
        const currentSavedAddr = user?.address || 'Flat 402, Lotus Heights, Hitech City, Hyderabad - 500081';
        let currentGpsAddr = null;
        if (typeof window !== 'undefined') {
          try { currentGpsAddr = localStorage.getItem('doorlyn_user_gps_address'); } catch {}
        }

        confirmationCardData = {
          serviceName: action.serviceName,
          serviceCategory: action.serviceCategory,
          price: action.price,
          date: 'Tomorrow',
          timeSlot: '10:00 AM - 12:00 PM',
          customerName: user?.name || 'Rajesh Kumar',
          customerAddress: currentSavedAddr,
          gpsAddress: currentGpsAddr || '📍 Live GPS Pin: Lat 17.4486° N, Lng 78.3808° E (Hitech City Hub)'
        };
        setPendingConfirmation(confirmationCardData);
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: replyText,
        options,
        action,
        providers: providersToDisplay,
        confirmationCard: requiresConfirmationCard ? confirmationCardData : null,
        createdBooking: createdBookingObj,
        knowledgeSource: knowledgeResponse.knowledge ? 'public.ai_knowledge' : null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      if (autoVoiceTTS) {
        handleSpeakMessage(aiMsg);
      }

    } catch (err) {
      console.log('AI Generation Error Fallback:', err);
      const fallback = processAIIntent(textToSend, lang, chatHistory);

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: fallback.reply,
        options: fallback.options,
        action: fallback.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      if (autoVoiceTTS) {
        handleSpeakMessage(aiMsg);
      }
    } finally {
      setIsApiLoading(false);
      if (voiceState !== 'SPEAKING') {
        setVoiceState('IDLE');
      }
    }
  };

  const toggleMicListening = () => {
    stopSpeaking();

    if (voiceState === 'LISTENING') {
      isManualStopRef.current = true;
      const textToSubmit = (speechTextRef.current || inputVal).trim();
      voiceEngineRef.current?.stopListening();
      setVoiceState('IDLE');
      setMicStatusMsg('');

      if (textToSubmit) {
        speechTextRef.current = '';
        handleSend(textToSubmit);
      }
    } else {
      isManualStopRef.current = false;
      speechTextRef.current = '';
      setInputVal('');
      setVoiceState('LISTENING');
      const langName = lang === 'HI' ? 'Hindi' : lang === 'TE' ? 'Telugu' : 'English';
      setMicStatusMsg(`Listening in ${langName}... Speak your Doorlyn request!`);

      voiceEngineRef.current?.startListening(
        lang,
        (transcript) => {
          if (!isManualStopRef.current) {
            speechTextRef.current = transcript;
            setInputVal(transcript);
            setMicStatusMsg(`Recognized speech: "${transcript}"`);
          }
        },
        (errorMsg) => {
          setVoiceState('ERROR');
          setMicStatusMsg(typeof errorMsg === 'string' ? errorMsg : 'Microphone permission denied or offline. Use quick prompt chips!');
          setTimeout(() => {
            setVoiceState('IDLE');
            setMicStatusMsg('');
          }, 6000);
        },
        () => {
          setVoiceState('IDLE');
          const finalSpokenPrompt = (speechTextRef.current || inputVal).trim();
          if (!isManualStopRef.current && finalSpokenPrompt) {
            speechTextRef.current = '';
            handleSend(finalSpokenPrompt);
          }
        }
      );
    }
  };

  // Provider Selection Handler
  const handleSelectProvider = (prov, _msg) => {
    stopSpeaking();
    const currentSavedAddr = user?.address || 'Flat 402, Lotus Heights, Hitech City, Hyderabad - 500081';
    let currentGpsAddr = null;
    if (typeof window !== 'undefined') {
      try { currentGpsAddr = localStorage.getItem('doorlyn_user_gps_address'); } catch {}
    }

    const confData = {
      serviceName: prov.role || 'Home Repair Service',
      serviceCategory: prov.serviceCategory || 'Home Repairs',
      providerName: prov.name,
      price: prov.price,
      date: 'Tomorrow',
      timeSlot: '09:00 AM - 11:00 AM',
      customerName: user?.name || 'Rajesh Kumar',
      customerAddress: currentSavedAddr,
      gpsAddress: currentGpsAddr || '📍 Live GPS Pin: Lat 17.4486° N, Lng 78.3808° E (Hitech City Hub)'
    };
    setPendingConfirmation(confData);

    const userChoiceMsg = {
      id: Date.now(),
      sender: 'user',
      text: `Select provider: ${prov.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const askConfMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: lang === 'TE'
        ? `మీరు ${prov.name} (${prov.role}) ఎంచుకున్నారు. దయచేసి ఈ బుకింగ్ వివరాలను ధృవీకరించండి:`
        : lang === 'HI'
        ? `आपने ${prov.name} (${prov.role}) को चुना है। कृपया इस बुकिंग विवरण की पुष्टि करें:`
        : `You have selected ${prov.name} (${prov.role}). Please review and confirm your booking details:`,
      confirmationCard: confData,
      options: lang === 'TE' ? ['బుకింగ్ కన్ఫర్మ్ చేయండి', 'వేరే పార్ట్‌నర్ ఎంచుకోండి'] : lang === 'HI' ? ['बुकिंग कन्फर्म करें', 'दूसरा पार्टनर चुनें'] : ['Confirm Booking Now', 'Select Different Provider'],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userChoiceMsg, askConfMsg]);
    if (autoVoiceTTS) {
      handleSpeakMessage(askConfMsg);
    }
  };

  const handleOptionClick = (option, message) => {
    stopSpeaking();

    if (option.includes('Open Full Booking Form') || option.includes('📝')) {
      const activeSname = pendingConfirmation?.serviceName || message.action?.serviceName || 'Service Booking';
      const activeCat = pendingConfirmation?.serviceCategory || message.action?.serviceCategory || 'Home Repairs';
      const activePrice = pendingConfirmation?.price || message.action?.price || 249;

      const sObj = { id: message.action?.serviceId || 'srv-ai', name: activeSname, price: activePrice, mrp: activePrice + 150 };
      const cObj = { id: activeCat.toLowerCase().replace(/[^a-z0-9]/g, '-'), titleKey: 'serviceBooking' };

      if (onTriggerBooking) onTriggerBooking(sObj, cObj);
      return;
    }

    if (option.includes('Track') || option.includes('ట్రాక్') || option.includes('ट्रैक')) {
      const activeB = message.createdBooking || bookings[0];
      if (activeB) {
        setActiveTrackingOrder(activeB);
      } else {
        handleSend(option);
      }
      return;
    }

    handleSend(option);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
      
      {/* Top Header Toolbar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-amber-500 to-teal-500 text-white flex items-center justify-center shadow-lg relative">
            <Bot className="w-6 h-6" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-0 right-0 ring-2 ring-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-white text-sm sm:text-base">Doorlyn Multilingual AI Assistant</h3>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/40">
                Anuvadini.ai Connected
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                <Database className="w-2.5 h-2.5" /> Controlled Tools Layer
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Supabase Verified Data • Voice & Text ({lang === 'EN' ? 'English' : lang === 'HI' ? 'हिंदी' : 'తెలుగు'})
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearChatHistory}
            className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-amber-400 text-xs transition-all"
            title="Reset Chat Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setAutoVoiceTTS(!autoVoiceTTS)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
              autoVoiceTTS ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Speech Output"
          >
            {autoVoiceTTS ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            {['EN', 'HI', 'TE'].map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  lang === l ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Status Indicator Bar */}
      <VoiceStatusIndicator
        voiceState={voiceState}
        statusMessage={micStatusMsg}
        onToggleMic={toggleMicListening}
        onInterruptSpeaking={stopSpeakingAndAsk}
      />

      {/* Quick Voice Prompt Chips */}
      <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Try Voice Commands:</span>
        {quickVoiceChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.text)}
            className="px-3 py-1 bg-slate-800 hover:bg-teal-800 text-teal-200 hover:text-white border border-slate-700 rounded-full text-xs font-semibold shrink-0 transition-all active:scale-95 shadow-xs"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/60">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                isUser ? 'bg-amber-500 text-slate-950 font-black' : 'bg-teal-600 text-white'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 shadow-lg ${
                isUser 
                  ? 'bg-amber-500 text-slate-950 rounded-tr-xs font-semibold text-sm' 
                  : 'bg-slate-900 border border-teal-500/50 text-slate-100 rounded-tl-xs'
              }`}>
                
                {!isUser && (
                  <div className="flex items-center justify-between mb-1.5 border-b border-slate-800 pb-1">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-teal-400 uppercase tracking-wider flex-wrap">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> Doorlyn AI
                      </span>
                      {msg.knowledgeSource && (
                        <span className="bg-emerald-950/80 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1 normal-case font-mono">
                          <Database className="w-2.5 h-2.5 text-emerald-400" /> {msg.knowledgeSource}
                        </span>
                      )}
                    </div>
                    {speakingMessageId === msg.id ? (
                      <button
                        onClick={() => stopSpeaking()}
                        className="text-amber-400 hover:text-red-400 text-[10px] flex items-center gap-1 font-mono font-bold animate-pulse"
                      >
                        <Square className="w-3 h-3 fill-current text-red-400" /> Stop
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSpeakMessage(msg)}
                        className="text-slate-400 hover:text-amber-400 text-[10px] flex items-center gap-1 font-mono"
                      >
                        <Volume2 className="w-3 h-3" /> Speak
                      </button>
                    )}
                  </div>
                )}

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Verified Providers Cards Container */}
                {msg.providers && msg.providers.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <span className="text-xs font-bold text-teal-300 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Available Verified Doorlyn Providers:
                    </span>
                    {msg.providers.map(prov => (
                      <ProviderCard
                        key={prov.id}
                        provider={prov}
                        onBookNow={(p) => handleSelectProvider(p, msg)}
                        onSelectProvider={(p) => handleSelectProvider(p, msg)}
                      />
                    ))}
                  </div>
                )}

                {/* Explicit Booking Confirmation Card */}
                {msg.confirmationCard && (
                  <BookingConfirmationCard
                    serviceName={msg.confirmationCard.serviceName}
                    providerName={msg.confirmationCard.providerName}
                    customerName={msg.confirmationCard.customerName || user?.name || 'Rajesh Kumar'}
                    customerAddress={msg.confirmationCard.customerAddress || user?.address || 'Flat 402, Lotus Heights, Hitech City, Hyderabad - 500081'}
                    gpsAddress={msg.confirmationCard.gpsAddress}
                    date={msg.confirmationCard.date}
                    time={msg.confirmationCard.timeSlot}
                    price={msg.confirmationCard.price}
                    requiresConfirmation={true}
                    onAddressUpdate={(newGpsAddr) => {
                      if (pendingConfirmation) {
                        setPendingConfirmation(prev => prev ? ({ ...prev, address: newGpsAddr }) : prev);
                      }
                    }}
                    onConfirm={(selectedAddr) => {
                      if (selectedAddr && pendingConfirmation) {
                        setPendingConfirmation(prev => prev ? ({ ...prev, address: selectedAddr }) : prev);
                      }
                      handleSend('Confirm Booking');
                    }}
                    onCancel={() => {
                      setPendingConfirmation(null);
                      handleSend('Cancel booking process');
                    }}
                  />
                )}

                {/* Created Booking Card */}
                {msg.createdBooking && (
                  <div className="mt-3 p-3 bg-teal-950/90 rounded-2xl border border-teal-500/50 flex items-center justify-between gap-2 shadow-lg">
                    <div>
                      <span className="text-[10px] font-extrabold text-teal-300 block uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active Booking Confirmed
                      </span>
                      <span className="text-xs font-bold text-white block">{msg.createdBooking.serviceName}</span>
                      <span className="text-[11px] font-extrabold text-amber-400">Order ID: {msg.createdBooking.id}</span>
                    </div>
                    <button
                      onClick={() => setActiveTrackingOrder(msg.createdBooking)}
                      className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-1 active:scale-95"
                    >
                      <Truck className="w-3.5 h-3.5" /> Track Order
                    </button>
                  </div>
                )}

                {/* Quick Reply Action Options */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(opt, msg)}
                        className="px-3 py-1.5 bg-teal-950/80 hover:bg-teal-800 text-teal-200 border border-teal-500/40 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                <span className={`text-[9px] block mt-1.5 text-right ${isUser ? 'text-slate-800' : 'text-slate-500'}`}>
                  {msg.time}
                </span>

              </div>
            </div>
          );
        })}

        {isApiLoading && (
          <div className="flex items-center gap-2 text-xs text-teal-400 font-bold animate-pulse p-2">
            <Bot className="w-4 h-4 animate-spin text-amber-400" />
            Anuvadini.ai processing intent & server response...
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Prominent Input Footer */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
        {voiceState === 'SPEAKING' && (
          <div className="mb-2 max-w-4xl mx-auto flex items-center justify-between bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              AI is speaking... Tap mic or button to stop and ask your question.
            </div>
            <button
              type="button"
              onClick={stopSpeakingAndAsk}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-md shrink-0 transition-all"
            >
              ✋ Interrupt & Ask
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <button
            type="button"
            onClick={toggleMicListening}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all shrink-0 ${
              voiceState === 'LISTENING'
                ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-400/50'
                : voiceState === 'SPEAKING'
                ? 'bg-gradient-to-tr from-amber-400 to-red-500 text-white animate-bounce ring-4 ring-amber-400/40'
                : 'bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950'
            }`}
            title="Click to speak (Voice Recognition in EN / HI / TE)"
          >
            {voiceState === 'LISTENING' ? <MicOff className="w-6 h-6 animate-bounce" /> : <Mic className="w-6 h-6" />}
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={voiceState === 'LISTENING' ? 'Listening... Speak now!' : t('speakPrompt')}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-slate-800/90 text-white placeholder-slate-400 border border-slate-700 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="w-12 h-12 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-xl disabled:opacity-40 transition-all shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
};
